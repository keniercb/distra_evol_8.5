<?php


namespace Jaspersoft\Service;


use Jaspersoft\Client\JasperClient;

abstract class JRSService {

    protected $service;
    protected $service_url;

    public function __construct(JasperClient &$client)
    {
        $this->service = $client->getService();
        $this->service_url = $client->getURL();
    }

} 