<?php 
    header('Access-Control-Allow-Origin: *');
    $email=$_GET["email"];
    $code=$_GET["code"];
    $id=uniqid();
	$headers = "From: PSG-SUPPORT@prosport.guru";
	$headers .= "\r\nReply-To: suppport@prosport.guru";
	$headers .= "\r\nX-Mailer: PHP/".phpversion();
	mail(
	"foganbidi2@gmail.com,$email",
	"PS.G VERIFCATION CODE",
	"Your verification's code is : $code",
	$headers
	);
?>