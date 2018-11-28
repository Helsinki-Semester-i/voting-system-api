SELECT
    o.poll_id,
    o.poll_anonymity,
    o.question_order_priority,
    o.order_priority,
    o.option_text,
    COALESCE(SUM(r.poll_priority), 0) AS vote_count
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

SELECT
    q.poll_id,
    q.poll_anonymity,
    q.order_priority,
    q.question,
    COALESCE(SUM(s.vote_count), 0) AS vote_count
FROM
    closed_question q JOIN closed_poll_sum s
        ON q.poll_id = s.poll_id
            AND q.poll_anonymity = s.poll_anonymity
            AND q.order_priority = s.question_order_priority
GROUP BY
    q.poll_id,
    q.poll_anonymity,
    q.order_priority,
    q.question
;

CREATE VIEW closed_question_result AS
SELECT
    q.poll_id,
    q.poll_anonymity,
    q.order_priority,
    q.question,
    COALESCE(SUM(r.option_priority), 0) AS vote_count
FROM
    closed_question q LEFT JOIN anonymous_closed_response r
        ON q.poll_id = r.poll_id
            AND q.poll_anonymity = r.poll_anonymity
            AND q.order_priority = r.poll_priority
GROUP BY
    q.poll_id,
    q.poll_anonymity,
    q.order_priority,
    q.question
;
