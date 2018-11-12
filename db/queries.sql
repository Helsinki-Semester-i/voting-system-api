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
                                    wiki_user_id = 1
                            ) p ON poll.id = p.poll_id
                    ) q
            ) AS polls
        FROM
            wiki_user
        WHERE
            id = 1
    ) t
;

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
                                            option_text
                                        FROM
                                            closed_option
                                        WHERE
                                            poll_id = 4 AND closed_question.order_priority = question_order_priority
                                        ORDER BY
                                            order_priority
                                    ) o
                            ) AS options
                        FROM
                            closed_question
                        WHERE
                            poll_id = 4
                        ORDER BY
                            order_priority
                    ) q
            ) AS questions
        FROM
            poll
        WHERE
            id = 4
    ) t
;

