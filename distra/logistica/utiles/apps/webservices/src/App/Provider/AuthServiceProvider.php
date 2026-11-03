<?php

namespace App\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Silex\Api\BootableProviderInterface;
use Silex\Api\EventListenerProviderInterface;
use Silex\Application;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthServiceProvider implements ServiceProviderInterface, BootableProviderInterface
{
    const AUTH_VALIDATE_CREDENTIALS = 'auth.validate.credentials';
    const AUTH_VALIDATE_TOKEN       = 'auth.validate.token';
    const AUTH_NEW_TOKEN            = 'auth.new.token';

    public function register(Container $app)
    {
        $app[self::AUTH_VALIDATE_CREDENTIALS] = $app->protect(function ($username, $password) use ($app) {
            return $this->validateCredentials($app,$username, $password);
        });

        $app[self::AUTH_VALIDATE_TOKEN] = $app->protect(function ($token) use ($app){
            return $this->validateToken($app,$token);
        });

        $app[self::AUTH_NEW_TOKEN] = $app->protect(function ($username) use ($app){
            return $this->getNewTokenForUser($app,$username);
        });
    }

    public function boot(Application $app)
    {
        $app->flush();
    }

    private function validateCredentials($app,$username, $password)
    {
        //username = administrador
        //password  = md5 21232f297a57a5a743894a0e4a801fc3
        $sql = "SELECT * FROM mod_seguridad.seg_usuario WHERE nombreusuario = ? AND contrasenna = ?";
        return $app['db']->fetchAssoc($sql, array($username, md5($password)));
        //return $app->json(['success' => true, 'result' => 0,'message' => 'Authentication successfully' ],  200);
    }

    private function getNewTokenForUser($app,$username)
    {
        if ($username) {
            $tokenId    = base64_encode(mcrypt_create_iv(32));
            $issuedAt   = time();
            $notBefore  = $issuedAt  + 10; //Adding 10 seconds
            $expire     = $notBefore + 604800; // Adding 1 week

            $class = '\\' . $app['NAMESPACE'] . '\\' . $app['JWT_SIGNER_ALGORITHM']; //Sha512,Sha384,Sha256

            $signer = new $class();
            $token = (new Builder())->setIssuer($app['JWT_ISSUER'])   // Configures the issuer (iss claim). Ej. http://example.com
            ->setAudience($app['JWT_AUDIENCE'])   // Configures the audience (aud claim). Ej. http://example.com
            ->setId($tokenId,true)  // Configures the id (jti claim), replicating as a header item
            ->setIssuedAt($issuedAt)    // Configures the time that the token was issue (iat claim)
            ->setNotBefore($notBefore)  // Configures the time that the token can be used (nbf claim)
            ->setExpiration($expire)    // Configures the expiration time of the token (nbf claim)
            ->set('data', ['JWT_DEFAULT_MSG' => $app['JWT_DEFAULT_MSG'], 'user' => $username])  // Configures a new claim, called "uid"
            ->sign($signer, $app['JWT_KEY_SECRECT']) // creates a signature using "testing" as key
            ->getToken();// Retrieves the generated token
            return [
                'success' => true,
                'status' => true,
                'result' => (!is_null(''.$token))? ['token' => ''.$token]:[],
                'message' =>(!is_null(''.$token))? 'Token generated successfully':'Token generated failure'
            ];
        } else {
            return ['success' => false, 'result' => 0,'message' => 'Failed to Authenticate.Invalid username and/or password' ];
        }
    }

    private function validateToken($app,$token)
    {
        try {
            $token = (new Parser())->parse($token);
        } catch (Exception $exception) {
            return false;
        }

        $validationData = new ValidationData();
        $validationData->setIssuer($app['JWT_ISSUER']);
        $validationData->setAudience($app['JWT_AUDIENCE']);

        return $token->validate($validationData);
    }
}