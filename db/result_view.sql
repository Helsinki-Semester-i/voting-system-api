CREATE VIEW closed_poll_result AS
SELECT
    o.poll_id,
    o.poll_anonymity,
    o.question_order_priority,
    o.order_priority,
    o.option_text,
    COUNT(r.poll_priority) AS vote_count
FROM
    closed_option o LEFT JOIN anonymous_closed_response r
        ON o.poll_id = r.poll_id
            AND o.poll_anonymity = r.poll_anonymity
            AND o.question_order_priority = r.poll_priority
            AND o.order_priority = r.option_priority
GROUP BY
    o.poll_id,
    o.poll_anonymity,
    o.question_order_priority,
    o.order_priority,
    o.option_text,
    r.option_priority
;
