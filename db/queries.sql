SELECT
    row_to_json(t)
FROM
    (
        SELECT
            *,
            (
                SELECT array_to_json(array_agg(row_to_json(q)))
                FROM
                    (
                        SELECT poll.*, p.vote_status
                        FROM poll JOIN (
                            SELECT *
                            FROM participation
                            WHERE wiki_user_id = 1
                        ) p ON poll.id = p.poll_id
                    ) q
            ) AS questions
        FROM wiki_user
        WHERE id = 1
    ) t
;
