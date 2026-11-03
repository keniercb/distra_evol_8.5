<?php

/*
 * El middleware de aplicación before te permite modificar el objeto Request antes de que se ejecute el controlador:
 * Por defecto este middleware se ejecuta después del enrutamiento y de la capa de seguridad.

Si quieres ejecutar este middleware incluso para las excepciones (por ejemplo cuando se produce un error de tipo 404 o 403) tienes que añadir lo siguiente al registrarlo:
 * */
//handling CORS preflight request
$app->before(function (Request $request) {
        $response = new Response();
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        $response->setStatusCode(200);

        return $response->send();
}, Application::EARLY_EVENT);
/*
 * Como en este caso no se ejecuta ni el enrutamiento ni la capa de seguridad, no tienes acceso ni al idioma del usuario, ni a la ruta actual ni al objeto de seguridad que representa al usuario.
 * Nota
El middleware before utiliza internamente el evento request de Symfony.
 * */


/*
 *3.1.2. El middleware after
El middleware de aplicación after te permite modificar el objeto Response antes de que se genere la respuesta enviada al usuario:
*/

//handling CORS respons with right headers
$app->after(function (Request $request, Response $response) {
    $response->headers->set('Access-Control-Allow-Origin', '*');
});
/*
 * Nota
El middleware after utiliza internamente el evento response de Symfony.
 * */

/*
El middleware de aplicación finish te permite ejecutar código después de haber enviado el objeto Response al usuario, por lo que es ideal para tareas como enviar emails o guardar mensajes de log:
*/
$app->finish(function (Request $request, Response $response) {
    // ...
    // ten en cuenta que cualquier cambio que hagas en Request
    // o Response se ignorará, porque la respuesta ya se ha
    // enviado al usuario
});
/*
Nota
El middleware finish utiliza internamente el evento terminate de Symfony.
*/

$app->error(function (\Exception $e, $code) use ($app) {
    $app['monolog']->addError($e->getMessage());
    $app['monolog']->addError($e->getTraceAsString());

    return new JsonResponse(
        array(
            'statusCode' => $code,
            'message' => $e->getMessage(),
            'stacktrace' => $e->getTraceAsString(),
        )
    );
});