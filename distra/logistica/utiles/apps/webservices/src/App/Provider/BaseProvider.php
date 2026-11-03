<?php

namespace App\Provider;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Provider\Interfaces\BaseProviderInterface;

abstract class BaseProvider implements ControllerProviderInterface, BaseProviderInterface
{
    const VALIDATE_CREDENTIALS = '/validateCredentials';
    const TOKEN_HEADER_KEY = 'X-Token';
    const AUTHORIZATION_HEADER_KEY = 'Authorization';
    const AUTHORIZATION_HEADER_TYPE = 'Bearer ';
    const TOKEN_REQUEST_KEY = '_token';
    protected $app;
    protected $baseRoute;
    protected $isLoggin;
    protected $token;
    protected $server;

    public function __construct()
    {
        $this->app = null;
        $this->baseRoute = '/auth';
        $this->isLoggin = false;
        $this->token = "";
        $this->server = "";
    }

    public function connect(Application $app)
    {
        $this->app = $app;

        $this->setUpMiddlewares($app);
        $this->initControllers();
        return $this->extractControllers($app);
    }


    private function extractControllers(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->get(self::VALIDATE_CREDENTIALS, function (Request $request) use ($app) {
            $username = $request->get('username');
            $password = $request->get('password');
            if ($username && $password) {
                $status = $app[AuthServiceProvider::AUTH_VALIDATE_CREDENTIALS]($username, $password);
                if ($status) {
                    $status = $this->app[AuthServiceProvider::AUTH_NEW_TOKEN]($username);
                    if ($status['success']) {
                        $this->token = $status['result']['token'];
                        $this->isLoggin = true;
                        return $this->app->json($status, 200);
                    } else {
                        $this->isLoggin = false;
                        return $this->app->json($status, 403);
                    }
                }
                $this->isLoggin = false;
                return $app->json(['success' => false, 'result' => 0, 'message' => 'Failed to Authenticate.Invalid username and/or password'], 403);

            } else {
                $this->isLoggin = false;
                return $app->json(['success' => false, 'result' => 0, 'message' => 'Failed to Authenticate.Invalid username and/or password'], 403);
            }
        });

        $this->routing($controllers);
        return $controllers;
    }

    private function setUpMiddlewares(Application $app)
    {
        $app->before(function (Request $request) use ($app) {
            if (!$this->isAuthRequiredForPath($request->getPathInfo())) {
                if ($token = $this->getTokenFromRequest($request)) {
                    if (!$this->isValidTokenForApplication($app, $token)) {
                        $this->isLoggin = false;
                        $this->token = "";
                        $this->requiredLoggin();
                        return $app->json(['success' => false, 'result' => 0, 'message' => 'Access Denied'], 401);
                    }
                } else {
                    $this->validateCredentials();
                }
            }
        });
        $app->after(function ($request, $response) use ($app) {

            if ($response instanceof JsonResponse) {
                $content = json_decode($response->getContent());
                $content->token = $this->token;
                $response->setJson(json_encode($content));
            }
        });
    }

    private function requiredLoggin()
    {
        $nonce = md5(uniqid());
        $opaque = md5(uniqid());
        $realm = 'Restricted area';
        header('HTTP/1.1 401 Unauthorized');
        header(sprintf('WWW-Authenticate: basic realm="%s",qop="auth", nonce="%s", opaque="%s"', $realm, $nonce, $opaque));
        header('Content-Type: text/html');
        echo('<html><head><title>Webservices Rest - Error report</title><style><!--h1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} h2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} h3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} body {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} b {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} p {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;} a {color : red;} a.name {color : black;} hr {color : #525D76;}--></style> </head><body><h1>HTTP Status 401 - Full authentication is required to access this resource</h1><HR size="1" noshade="noshade"><p><b>type</b> Status report</p><p><b>message</b> <u>Full authentication is required to access this resource</u></p><p><b>description</b> <u>This request requires HTTP authentication.</u></p><HR size="1" noshade="noshade"></body></html>');
        exit;
    }

    private function validateCredentials()
    {
        $this->server = $this->app['request_stack']->getCurrentRequest()->server;

        if (isset($this->server->all()['PHP_AUTH_USER'])) {
            $username = $this->server->all()['PHP_AUTH_USER'];
            $password = $this->server->all()['PHP_AUTH_PW'];
        } elseif (isset($this->server->all()['PHP_AUTH_DIGEST'])) {
            if (strpos(strtolower($this->server->all()['PHP_AUTH_DIGEST']), 'digest') === 0) {
                list($username, $password) = explode(':', base64_decode(substr($this->server->all()['HTTP_AUTHORIZATION'], 7)));
            }
        }
        if (is_null($username)) {
            $this->isLoggin = false;
            $this->token = "";
            $this->requiredLoggin();
        } else {
            $status = $this->app[AuthServiceProvider::AUTH_VALIDATE_CREDENTIALS]($username, $password);
            if ($status) {
                $status = $this->app[AuthServiceProvider::AUTH_NEW_TOKEN]($username);
                if ($status['success']) {
                    $this->token = $status['result']['token'];
                    $this->isLoggin = true;
                    return $this->app->json($status, 200);
                } else {
                    $this->isLoggin = false;
                    return $this->app->json($status, 403);
                }
            } else {
                $this->isLoggin = false;
                $this->requiredLoggin();
            }
        }
    }

    private function getTokenFromRequest(Request $request)
    {
        $rawHeader = $request->headers->get(self::TOKEN_HEADER_KEY);
        if ($rawHeader) {
            return $request->headers->get(self::TOKEN_HEADER_KEY);
        } else {
            return false;
        }
    }

    private function isAuthRequiredForPath($path)
    {
        return in_array($path, [$this->app['api'] . $this->baseRoute . self::VALIDATE_CREDENTIALS]);
    }

    private function isValidTokenForApplication(Application $app, $token)
    {
        if ($token) {
            return $app[AuthServiceProvider::AUTH_VALIDATE_TOKEN]($token);
        }
        return false;
    }
}
