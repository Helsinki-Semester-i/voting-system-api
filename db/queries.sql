SELECT
    row_to_json(t)
FROM
    (
        SELECT
            *,
            (
                SELECT array_to_json(array_agg(row_to_json(poll)))
                FROM poll JOIN (
                    SELECT *
                    FROM participation
                    WHERE wiki_user_id = 1
                ) p ON poll.id = p.poll_id
            ) AS questions
        FROM wiki_user
        WHERE id = 1
    ) t
;


