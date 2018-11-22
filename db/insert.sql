INSERT INTO wiki_user(first_name, last_name, email, phone) VALUES('andres','barro','a@gmail.com','331288462');


INSERT INTO poll(title, details, acceptance_percentage,anonymity) VALUES('votacion de comida','sushi o sushi','34%',true);

INSERT INTO poll(title, details, creation_date, close_date, acceptance_percentage,anonymity) VALUES('votacion de comida2','sushi o sushi2',to_date('2018-12-02', 'YYYY-MM-DD'), to_date('2018-12-05', 'YYYY-MM-DD'),34,true);
SELECT * FROM poll WHERE title = 'votacion de comida' AND details = 'sushi o sushi' AND creation_date = to_date('2018-12-01', 'YYYY-MM-DD') AND close_date = to_date('2018-12-03', 'YYYY-MM-DD');
SELECT * FROM poll WHERE title = $1 AND details = $2;
SELECT * FROM poll WHERE title = 'votacion de comida' AND details = 'sushi o sushi';


INSERT INTO participation( poll_anonymity,vote_status) VALUES(true,'seen');


INSERT INTO open_question( poll_anonymity,order_priority, question) VALUES(true,3,'traemos sushi factory?');


INSERT INTO closed_question( poll_anonymity,order_priority, question) VALUES(true,5,'traemos tokai?');
INSERT INTO closed_question(poll_id, poll_anonymity, order_priority, question) VALUES (13, true, 1, 'Tokai');
INSERT INTO closed_question(poll_id, poll_anonymity, order_priority, question) VALUES (13, true, 2, 'Okuma');
INSERT INTO closed_question(poll_id, poll_anonymity, order_priority, question) VALUES (13, true, 3, 'Sushi Factory');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 1, 1, 'Muy en contra');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 1, 2, 'En contra');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 1, 3, 'Neutral');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 1, 4, 'A favor');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 1, 5, 'Muy a favor');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 2, 1, 'Muy en contra');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 2, 2, 'En contra');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 2, 3, 'Neutral');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 2, 4, 'A favor');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 2, 5, 'Muy a favor');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 3, 1, 'Muy en contra');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 3, 2, 'En contra');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 3, 3, 'Neutral');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 3, 4, 'A favor');
INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES (13,true, 3, 5, 'Muy a favor');


INSERT INTO closed_option( poll_anonymity,question_order_priority, order_priority,option_text) VALUES(true,5,,7,'esta mejor sushi factory');


INSERT INTO anonymous_ballot( poll_anonymity,unique_code) VALUES(true,5865);


INSERT INTO ballot( poll_anonymity,unique_code) VALUES(true,5865);


INSERT INTO open_response( poll_anonymity,unique_code) VALUES(true,5865);


INSERT INTO closed_response( poll_anonymity,poll_priority,option_priority) VALUES(true,5,6);


INSERT INTO anonymous_open_response( poll_anonymity,poll_priority,answer) VALUES(true,5,'si quiero');


INSERT INTO anonymous_closed_response( poll_anonymity,poll_priority,option_priority) VALUES(true,5,6);



List of relations
 Schema |           Name            |   Type   |  Owner
--------+---------------------------+----------+----------
 public | anonymous_ballot          | table    | postgres
 public | anonymous_ballot_id_seq   | sequence | postgres
 public | anonymous_closed_response | table    | postgres
 public | anonymous_open_response   | table    | postgres
 public | ballot                    | table    | postgres
 public | ballot_id_seq             | sequence | postgres
 public | closed_option             | table    | postgres
 public | closed_question           | table    | postgres
 public | closed_response           | table    | postgres
 public | open_question             | table    | postgres
 public | open_response             | table    | postgres
 public | participation             | table    | postgres
 public | poll                      | table    | postgres
 public | poll_id_seq               | sequence | postgres
 public | wiki_user                 | table    | postgres
 public | wiki_user_id_seq          | sequence | postgres

anonymous_ballot
 id | poll_id | poll_anonymity | unique_code

 anonymous_closed_response
 ballot_id | poll_id | poll_anonymity | poll_priority | option_priority

 participation
 wiki_user_id | poll_id | poll_anonymity | vote_status

 