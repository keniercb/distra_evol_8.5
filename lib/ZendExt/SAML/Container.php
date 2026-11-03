<?php

/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 15/03/16
 * Time: 13:54
 */
class ZendExt_SAML_Container extends SAML2\Compat\AbstractContainer
{
    /**
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;

    /**
     * Create a new SimpleSAMLphp compatible container.
     */
    public function __construct()
    {
    }

    /**
     * {@inheritdoc}
     */
    public function getLogger()
    {
    }

    /**
     * {@inheritdoc}
     */
    public function generateId()
    {
        return '_' . base64_encode(openssl_random_pseudo_bytes(30));
    }

    /**
     * {@inheritdoc}
     */
    public function debugMessage($message, $type)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function redirect($url, $data = array())
    {
        $response = new Zend_Controller_Response_Http();
        $response->setRedirect($url);
        return $response;
    }

    /**
     * {@inheritdoc}
     */
    public function postRedirect($url, $data = array())
    {
        $template = __DIR__."/../../../config/xml/saml/templates/post.tpl";
        $classview = new ZendExt_Templates_h2o($template);
        $plantilla = $classview->render(array('url'=>$url,'data'=>$data));
        $response = new Zend_Controller_Response_Http();
        $response->setBody($plantilla);
        return $response;
    }
}