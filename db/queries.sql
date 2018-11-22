-- Hardcoded values are to be changed for parameters

-- GET user
SELECT
    row_to_json(t)
FROM
    (
        SELECT
            *,
            (
                SELECT
                    array_to_json(array_agg(row_to_json(q)))
                FROM
                    (
                        SELECT
                            poll.*,
                            p.vote_status
                        FROM
                            poll JOIN (
                                SELECT
                                    *
                                FROM
                                    participation
                                WHERE
                                    wiki_user_id = $1
                            ) p ON poll.id = p.poll_id
                    ) q
            ) AS polls
        FROM
            wiki_user
        WHERE
            id = $1
    ) t
;

-- GET poll
SELECT
    row_to_json(t)
FROM
    (
        SELECT
            *,
            (
                SELECT
                    array_to_json(array_agg(row_to_json(q)))
                FROM
                    (
                        SELECT
                            question,
                            (
                                SELECT
                                    array_to_json(array_agg(row_to_json(o)))
                                FROM
                                    (
                                        SELECT
                                            option_text, 
                                            order_priority
                                        FROM
                                            closed_option
                                        WHERE
                                            poll_id = $1 AND closed_question.order_priority = question_order_priority
                                        ORDER BY
                                            order_priority
                                    ) o
                            ) AS options
                        FROM
                            closed_question
                        WHERE
                            poll_id = $1
                        ORDER BY
                            order_priority
                    ) q
            ) AS questions
        FROM
            poll
        WHERE
            id = $1
    ) t
;

-- GET result
SELECT
    row_to_json(t)
FROM
    (
        SELECT
            *,
            (
                SELECT
                    array_to_json(array_agg(row_to_json(q)))
                FROM
                    (
                        SELECT
                            question,
                            (
                                SELECT
                                    array_to_json(array_agg(row_to_json(o)))
                                FROM
                                    (
                                        SELECT
                                            option_text,
                                            vote_count
                                        FROM
                                            closed_poll_result
                                        WHERE
                                            poll_id = $1 AND closed_question.order_priority = question_order_priority
                                        ORDER BY
                                            order_priority
                                    ) o
                            ) AS options
                        FROM
                            closed_question
                        WHERE
                            poll_id = $1
                        ORDER BY
                            order_priority
                    ) q
            ) AS questions
        FROM
            poll
        WHERE
            id = $1
    ) t
;

-- GET ballot
SELECT
    row_to_json(t)
FROM
    (
        SELECT
            *,
            (
                SELECT
                    row_to_json(p)
                FROM
                    (
                        SELECT
                            *,
                            (
                                SELECT
                                    array_to_json(array_agg(row_to_json(q)))
                                FROM
                                    (
                                        SELECT
                                            question,
                                            (
                                                SELECT
                                                    array_to_json(array_agg(row_to_json(o)))
                                                FROM
                                                    (
                                                        SELECT
                                                            option_text,
                                                            (CASE WHEN closed_option.order_priority = anonymous_closed_response.option_priority THEN true ELSE false END) AS chosen
                                                        FROM
                                                            closed_option LEFT JOIN anonymous_closed_response
                                                                ON closed_option.poll_id = anonymous_closed_response.poll_id
                                                                    AND closed_option.poll_anonymity = anonymous_closed_response.poll_anonymity
                                                                    AND closed_option.question_order_priority = anonymous_closed_response.poll_priority
                                                        WHERE
                                                            closed_option.poll_id = poll.id
                                                            AND closed_question.order_priority = question_order_priority
                                                            AND anonymous_closed_response.ballot_id = anonymous_ballot.id
                                                        ORDER BY
                                                            order_priority
                                                    ) o
                                            ) AS question_option
                                        FROM
                                            closed_question
                                        WHERE
                                            closed_question.poll_id = poll.id
                                        ORDER BY
                                            order_priority
                                    ) q
                            ) AS questions
                        FROM
                            poll
                        WHERE
                            id = anonymous_ballot.poll_id
                    ) p
            ) AS poll
        FROM
            anonymous_ballot
        WHERE
            unique_code=$1
    ) t
;