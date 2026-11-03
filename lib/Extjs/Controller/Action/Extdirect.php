<?php
/**
 * Created by JetBrains PhpStorm.
 * User: ymorejonb
 * Date: 27/06/13
 * Time: 17:19
 * To change this template use File | Settings | File Templates.
 */

class Extjs_Controller_Action_Extdirect extends ZendExt_Controller_Secure {

    public $extdirectConfig = null;

    public $extdirectClasses = array();

    public $extdirectNamespace = null;

    public function init() {

        parent::init();

        $this->extdirectClasses = array_merge($this->extdirectClasses, array(get_class($this)));
        $this->extdirectConfig = new Zend_Config_Ini( Zend_Registry::get('config')->extdirect_config, 'extdirect', true);
        if ($this->extdirectNamespace === null)
            $this->extdirectNamespace = $this->extdirectConfig->extdirect->namespace;
        $this->extdirectConfig->merge(new Zend_Config(array('extdirect' => array('classes' => $this->extdirectClasses, 'namespace' => $this->extdirectNamespace))));

        if ($this->getRequest()->getActionName() == 'extendJSGetApi') {
            $response = new Zend_Controller_Response_Http();
            $this->getFrontController()->setResponse($response);
        } elseif ($this->getRequest()->getActionName() == $this->extdirectConfig->extdirect->routerUrl) {
            $request = new Extjs_Controller_Request_RawJson();
            $this->setRequest($request);
            $front = Zend_Controller_Front::getInstance ();
            $front->setRequest ( $request );
            $response = new Extjs_Controller_Response_Extjs();
            $this->setResponse($response);
            $front->setResponse ( $response );
            $front->throwExceptions(false);
            $extjshelper = new Extjs_Controller_Action_Helper_Extjs();
            Zend_Controller_Action_HelperBroker::addHelper($extjshelper);
        }
    }

    /**
     * Index action is responsible for adding the extjs requests to the stack
     * Doing the routing part...
     */
    public function extendJSRooterAction() {
        // action body
        // do the handling of your ajax request
        $request = $this->getRequest ();
        /* @var $request Extjs_Controller_Request_RawJson */
        if ($request->requestCount !== 0) {
            $params = $this->getRequest ()->getParams ();
            foreach ( $params ['RawJson'] as $json ) {
                $jsonrequest = clone $request;
                /* @var $request Extjs_Controller_Request_RawJson */
                /* Controllers in extjs are called actions and actions are methods */
                $data ['extparams'] = $json;
                $jsonrequest->setActionName ( strtolower( $json ["method"] ) )->setControllerName ( ucfirst ( strtolower ( $json ["action"] ) ) )->setParams ( $data );
                $this->_helper->actionStack ( $jsonrequest );
            }
        }
    }
    /**
     * javascript include to declare Ext.Direct functions
     */
    public function extendJSGetApiAction() {
        $this->setResponse ( $this->getFrontController ()->getResponse () );
        $this->getResponse ()->setHeader ( 'content-type', 'text/javascript', true );
        $controllerDirs = $this->getFrontController ()->getControllerDirectory ();
        foreach ( $this->extdirectConfig->extdirect->classes as $class ) {
            if (class_exists($class)) {
                $classname = preg_replace ( '/Controller$/', '', $class, 1 );
                $loadedFile = true;
                if (! $this instanceof $class)
                    $loadedFile = Zend_Loader::loadFile ( $class . ".php", $controllerDirs, true );
                if ($loadedFile) {
                    $rClass = new ReflectionClass ( $class );
                    if (strlen ( $rClass->getDocComment () ) > 0) {
                        $doc = $rClass->getDocComment ();
                        if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->nameAttribute . ' ([\w]+)/', $doc, $matches )) {
                            $classname = $matches [1];
                        }
                    }
                    $rMethods = $rClass->getMethods ();
                    $methods = array();
                    foreach ( $rMethods as $rMethod ) {
                        /* @var $rMethod ReflectionMethod */
                        if ($rMethod->isPublic () && strlen ( $rMethod->getDocComment () ) > 0) {
                            $doc = $rMethod->getDocComment ();
                            $isRemote = ! ! preg_match ( '/' . $this->extdirectConfig->extdirect->remoteAttribute . '/', $doc );
                            if ($isRemote) {
                                $method = array ('name' => preg_replace ( '/Action$/', '', $rMethod->getName (), 1 ), 'len' => $rMethod->getNumberOfParameters ());
                                if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->argLenAttribute . ' ([\w]+)/', $doc, $matches )) {
                                    $method ['len'] = $matches [1];
                                }
                                if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->nameAttribute . ' ([\w]+)/', $doc, $matches )) {
                                    $method ['serverMethod'] = $method ['name'];
                                    $method ['name'] = $matches [1];
                                }
                                if (! ! preg_match ( '/' . $this->extdirectConfig->extdirect->formAttribute . '/', $doc )) {
                                    $method ['formHandler'] = true;
                                }
                                $methods [] = $method;
                            }
                        }
                    }
                    if (count ( $methods ) > 0) {
                        $classes [$classname] = $methods;
                    }
                }
            }

        }
        $api = array ('url' => $this->extdirectConfig->extdirect->routerUrl, 'type' => $this->extdirectConfig->extdirect->type, 'actions' => $classes );
        if ($this->extdirectConfig->extdirect->namespace !== false) {
            if(!empty($this->extdirectConfig->extdirect->namespace)){
                $api ['namespace'] = $this->extdirectConfig->extdirect->namespace;
                //$this->view->namespace = $api ['namespace'];
            }
        }
        //$this->view->api = $api;
        //$this->view->descriptor = $this->extdirectConfig->extdirect->descriptor;
        $descriptor = $this->extdirectConfig->extdirect->descriptor;

        //Esto debe ir en una plantilla.
        $this->getResponse()->appendBody(($api['namespace'] ? 'Ext.ns(\'' . substr($descriptor, 0, strrpos($descriptor, '.')) . '\'); ' . $descriptor : $descriptor ) . ' = '. json_encode($api) . ';');
    }

    /**
     * Ejecuta o despacha la accion
     *
     * @param string $action - Nombre de la accion
     * @return void
     */
    public function dispatch($action) {
        try {
            $rMethod = new ReflectionMethod(get_class($this), $action);
            $doc = $rMethod->getDocComment();
            $isRemote = ! ! preg_match ( '/' . $this->extdirectConfig->extdirect->remoteAttribute . '/', $doc );

            // Notify helpers of action preDispatch state
            $this->_helper->notifyPreDispatch();
            $this->preDispatch();

            $this->getRequest()->setDispatched();
            if (! $isRemote)
                $this->$action();
            else {
                $request = $this->getRequest()->getParams();
                $params = ( $request["extparams"]["data"] ) ? $request["extparams"]["data"] : array();
                $return =  call_user_func_array(array($this, $action), $params);
                if ($return)
                    $this->_helper->extjs->add($return);
            }

            $this->postDispatch();
            $this->_helper->notifyPostDispatch();
        } catch (Exception $e) {
            try {
                if (! $e instanceof ZendExt_Exception)
                    $e = new ZendExt_Exception('NOCONTROLLED', $e);
                $this->failedDispatch($e);
            } catch (ZendExt_Exception $e) {
                if (! $isRemote)
                    throw $e;
                else {
                    $this->_helper->extjs->add($e);
                }
            }
        }
    }
}