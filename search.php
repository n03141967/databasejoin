<?php


$url = 'http://192.168.16.117/joomla395/index.php?option=com_fabrik&format=raw&view=plugin&task=pluginAjax&g=element&element_id=55&formid=10&plugin=databasejoin&method=autocomplete_options&package=fabrik';

$cURL = curl_init();

curl_setopt($cURL, CURLOPT_URL, $url);
curl_setopt($cURL, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($cURL, CURLOPT_HTTPGET, true);

curl_setopt($cURL, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Accept: application/json'
));

$result = json_decode(curl_exec($cURL));

curl_close($cURL);


$q = $_GET['q'];


$results = array();
foreach($result as $item){
	if( stripos($item->text,$q) === 0 ){
		$results[] = array('id' => $item->value, 'text' => $item->text);
	}
}
echo json_encode(array('q' => $q, 'results' => $results));


