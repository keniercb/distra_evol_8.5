<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Firebase\JWT\JWT;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Signer\Hmac\Sha256;


class AuthenticateController extends BaseController
{
    public function authenticate(Application $app, Request $request)
    {
        $username = $request->get('username');
        $password = $request->get('password');

        if ($username && $password) {
            $sql = "SELECT * FROM mod_seguridad.seg_usuario WHERE nombreusuario = ? AND contrasenna = ?";
            $user = $app['db']->fetchAssoc($sql, array($username, md5($password)));

            if ($user) {
                $tokenId    = base64_encode(mcrypt_create_iv(32));
                $issuedAt   = time();
                $notBefore  = $issuedAt; //Adding 10 seconds
                $expire     = $notBefore + 604800; // Adding 1 week
                $serverName = $app['serverName']; // Retrieve the server name from config file

                $id = 1; //TODO: da cambiare

                $data = [
                    'iat'  => $issuedAt,         // Issued at: time when the token was generated
                    'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
                    'iss'  => $serverName,       // Issuer
                    'nbf'  => $notBefore,        // Not before
                    'exp'  => $expire,           // Expire
                    'data' => [                  // Data related to the signer user
                        'userId'   => $user['id'], // userid from the users table
                        'userName' => $user['username'], // User name
                    ]
                ];
                // Get the secret key for signing the JWT from an environment variable
                $secretKey = base64_decode($app['JWT_KEY_SECRECT']);

                $algorithm = $app['JWT_ALGORITHM'];
                // Sign the JWT with the secret key
                $jwt = JWT::encode(
                    $data,
                    $secretKey,
                    $algorithm
                );
                return $this->to_json(['success' => true, 'result' => 0,'message' => 'Failed to Authenticate','token' => $jwt],200);
            } else {
                return $this->to_json(['success' => false, 'result' => 0,'message' => 'Failed to Authenticate'],403);
            }
        } else {
            return $this->to_json(['success' => false, 'result' => 0,'message' => 'Failed to Authenticate'],403);
        }
    }


    public function login($username, $password) {
        $username = $this->getParam('username');
        $password = $this->getParam('password');
        if ($username && $password) {
            $sql = "SELECT * FROM mod_seguridad.seg_usuario WHERE nombreusuario = ? AND contrasenna = ?";
            $user = $this->app['db']->fetchAssoc($sql, array($username, $password));
            if ($user) {

                $tokenId    = base64_encode(mcrypt_create_iv(32));
                $issuedAt   = time();
                $notBefore  = $issuedAt  + 10; //Adding 10 seconds
                $expire     = $notBefore + 604800; // Adding 1 week

                $class = '\\' . $this->app['NAMESPACE'] . '\\' . $this->app['JWT_SIGNER_ALGORITHM']; //Sha512,Sha384,Sha256

                $signer = new $class();
                $token = (new Builder())->setIssuer($this->app['JWT_ISSUER'])   // Configures the issuer (iss claim). Ej. http://example.com
                ->setAudience($this->app['JWT_AUDIENCE'])   // Configures the audience (aud claim). Ej. http://example.com
                ->setId($tokenId,true)  // Configures the id (jti claim), replicating as a header item
                ->setIssuedAt($issuedAt)    // Configures the time that the token was issue (iat claim)
                ->setNotBefore($notBefore)  // Configures the time that the token can be used (nbf claim)
                ->setExpiration($expire)    // Configures the expiration time of the token (nbf claim)
                ->set('data', ['JWT_DEFAULT_MSG' => $this->app['JWT_DEFAULT_MSG'], 'user' => $user])  // Configures a new claim, called "uid"
                ->sign($signer, $this->app['JWT_KEY_SECRECT']) // creates a signature using "testing" as key
                ->getToken();// Retrieves the generated token
                return $this->to_json(['success' => true, 'result' => 1, 'message' => 'Token generated successfully', 'token' => '' . $token ],  200  );
            } else {
                return $this->to_json(['success' => false, 'result' => 0,'message' => 'Failed to Authenticate.Invalid username and/or password' ],  403);
            }
        } else {
            return $this->to_json(['success' => false, 'result' => 0,'message' => 'Failed to Authenticate'],  403 );
        }
    }

    protected function validateToken($token) {
        try {
            $token = (new Parser())->parse($token);
        } catch (Exception $exception) {
            return false;
        }

        $validationData = new ValidationData();
        $validationData->setIssuer('JWT Distra');
        $validationData->setAudience('JWT Distra');

        return $token->validate($validationData);
    }

    protected function adminPassword($token) {
        if ($this->validateToken($token)) {
            return $this->to_json(['success' => true, 'result' => 1, 'message' => 'The admin\'s password is: ' . PASSWORD]);
        } else {
            return $this->to_json(['success' => false, 'result' => 0, 'message' => 'Invalid token']);
        }
    }
}
