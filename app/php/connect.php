<?php
	// connect DB
	define (DB_USER, "root");
	define (DB_PASSWORD, "");
	define (DB_DATABASE, "table-crud");
	define (DB_HOST, "localhost");
	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
?>