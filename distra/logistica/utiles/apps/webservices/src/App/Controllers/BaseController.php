<?php

namespace App\Controllers;
use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;

abstract class BaseController
{

    protected $implService;
    protected $app;
    protected $request;

    public function __construct(Application $app,$service)
    {
        $this->request = $app['request_stack']->getCurrentRequest();
        $this->app = $app;
        $this->implService = $service;
    }

    protected function getParam($key)
    {
        $postParams = $this->request->request->all();
        $getParams = $this->request->query->all();
        if (isset($postParams[$key])) {
            return $postParams[$key];
        } elseif (isset($getParams[$key])) {
            return $getParams[$key];
        } elseif ($this->request->get($key)) {
            return $this->request->get($key);
        } else {
            return null;
        }
    }

    public function setDefaultValue(&$variable, $value = null)
    {
        if (!is_null($value) && is_null($variable)) {
            $variable = $value;
        }
    }
    /**
     * @param mixed $data    The response data
     * @param int   $status  The response status code
     * @param array $headers An array of response headers
     * @param bool  $json    If the data is already a JSON string
     */
    public function to_json($data = null, $status = 200, $headers = array(), $json = false){
        return new JsonResponse($data, $status, $headers, $json);
    }
}
