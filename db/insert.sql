INSERT INTO wiki_user(first_name, last_name, email, phone) VALUES('andres','barro','a@gmail.com','331288462');


INSERT INTO poll(title, details, acceptance_percentage,anonymity) VALUES('votacion de comida','sushi o sushi','34%',true);

INSERT INTO poll(title, details, creation_date, close_date, acceptance_percentage,anonymity) VALUES('votacion de comida2','sushi o sushi2',to_date('2018-12-02', 'YYYY-MM-DD'), to_date('2018-12-05', 'YYYY-MM-DD'),34,true);
SELECT * FROM poll WHERE title = 'votacion de comida' AND details = 'sushi o sushi' AND creation_date = to_date('2018-12-01', 'YYYY-MM-DD') AND close_date = to_date('2018-12-03', 'YYYY-MM-DD');
SELECT * FROM poll WHERE title = $1 AND details = $2;
SELECT * FROM poll WHERE title = 'votacion de comida' AND details = 'sushi o sushi';


INSERT INTO participation( poll_anonymity,vote_status) VALUES(true,'seen');


INSERT INTO open_question( poll_anonymity,order_priority, question) VALUES(true,3,'traemos sushi factory?');


INSERT INTO closed_question( poll_anonymity,order_priority, question) VALUES(true,5,'traemos tokai?');


INSERT INTO closed_option( poll_anonymity,question_order_priority, order_priority,option_text) VALUES(true,5,,7,'esta mejor sushi factory');


INSERT INTO anonymous_ballot( poll_anonymity,unique_code) VALUES(true,5865);


INSERT INTO ballot( poll_anonymity,unique_code) VALUES(true,5865);


INSERT INTO open_response( poll_anonymity,unique_code) VALUES(true,5865);


INSERT INTO closed_response( poll_anonymity,poll_priority,option_priority) VALUES(true,5,6);


INSERT INTO anonymous_open_response( poll_anonymity,poll_priority,answer) VALUES(true,5,'si quiero');


INSERT INTO anonymous_closed_response( poll_anonymity,poll_priority,option_priority) VALUES(true,5,6);
