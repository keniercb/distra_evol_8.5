<?php

/**
 * ZendExt_Weaver
 * 
 * Tejedor de aspectos arquitectonicos
 * 
 * @author Yoandry Morejon Borbon
 * @package ZendExt
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
final class ZendExt_Weaver implements ZendExt_Aspect_ISinglenton {
    const AOP_EXCEPTION_ACTIVE = false;

    private static $xmlAspect;
    private static $xmlAspectTemplate;
    private static $xmlAspectTemplateMT;
    private static $xmlWeaver;
    private static $controller;
    private static $action;
    private static $module;
    private static $actionRegister = array();
    private $idActiveAction = '';
    private $xmlActiveAction;
    private $property = array();
    private $initAspect = false;

    private function __construct() {
        
    }

    static public function getInstance() {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    public function __get($name) {
        if ($this->initAspect) {
            $this->property = array();
            $this->idActiveAction = '';
            $this->initAspect = false;
        }
        $this->property[] = $name;
        $this->idActiveAction .= '_' . $name;
        return $this;
    }

    public function __call($name, $arguments) {
        $this->initAspect = true;
        if ($name == 'init')
            $this->initAspects();
        else
            throw new ZendExt_Exception('WEAVER07');
        return $this;
    }

    private function initAspects() {
        if (!isset(self::$actionRegister[$this->idActiveAction])) {
            $this->initXmlWeaver();
            $this->initMTAspects();
            $aspectTemplateName = $this->getAspectTemplateName();
            if ($aspectTemplateName != null) {
                $this->initXmlAspectTemplate();
                if (isset(self::$xmlAspectTemplate->$aspectTemplateName->aspect)) {
                    foreach (self::$xmlAspectTemplate->$aspectTemplateName->aspect as $aspect) {
                        if ($aspect['execution'] == 'pre')
                            self::$actionRegister[$this->idActiveAction]['pre'][] = $aspect;
                        elseif ($aspect['execution'] == 'post')
                            self::$actionRegister[$this->idActiveAction]['post'][] = $aspect;
                        elseif ($aspect['execution'] == 'failed')
                            self::$actionRegister[$this->idActiveAction]['failed'][] = $aspect;
                    }
                }
                elseif (self::AOP_EXCEPTION_ACTIVE)
                    throw new ZendExt_Exception('WEAVER01');
            }
            elseif (self::AOP_EXCEPTION_ACTIVE)
                throw new ZendExt_Exception('WEAVER02');
        }
    }

    private function initMTAspects() {
        $this->initXmlAspectTemplateMT();
        if (isset(self::$xmlAspectTemplateMT->aspect)) {
            foreach (self::$xmlAspectTemplateMT->aspect as $aspect) {
                if ($aspect['execution'] == 'pre')
                    self::$actionRegister[$this->idActiveAction]['pre'][] = $aspect;
                elseif ($aspect['execution'] == 'post')
                    self::$actionRegister[$this->idActiveAction]['post'][] = $aspect;
                elseif ($aspect['execution'] == 'failed')
                    self::$actionRegister[$this->idActiveAction]['failed'][] = $aspect;
            }
        }
        elseif (self::AOP_EXCEPTION_ACTIVE)
            throw new ZendExt_Exception('WEAVER03');
    }

    private function initXmlWeaver() {
        if (!isset(self::$xmlWeaver))
            self::$xmlWeaver = ZendExt_FastResponse::getXML('weaver');
    }

    private function getAspectTemplateName() {
        $tempXmlElementWeaver = self::$xmlWeaver;

        foreach ($this->property as $property) {
            if (isset($tempXmlElementWeaver->$property))
                $tempXmlElementWeaver = $tempXmlElementWeaver->$property;
            else
                break;
        }
        $this->xmlActiveAction = $tempXmlElementWeaver;
        if (isset($this->xmlActiveAction['aspecttemplate'])) {
            return (string) $this->xmlActiveAction['aspecttemplate'];
        }
        return null;
    }

    private function initXmlAspectTemplateMT() {
        if (!isset(self::$xmlAspectTemplateMT))
            self::$xmlAspectTemplateMT = ZendExt_FastResponse::getXML('aspecttemplatemt');
    }

    private function initXmlAspectTemplate() {
        if (!isset(self::$xmlAspectTemplate))
            self::$xmlAspectTemplate = ZendExt_FastResponse::getXML('aspecttemplate');
    }

    private function initXmlAspect() {
        if (!isset(self::$xmlAspect))
            self::$xmlAspect = ZendExt_FastResponse::getXML('aspect');
    }

    public function preAction() {
        if (isset(self::$actionRegister[$this->idActiveAction]['pre']))
            $this->eventAction(self::$actionRegister[$this->idActiveAction]['pre']);
    }

    public function postAction() {
        if (isset(self::$actionRegister[$this->idActiveAction]['post']))
            $this->eventAction(self::$actionRegister[$this->idActiveAction]['post']);
    }

    public function failedAction($e) {
        if (isset(self::$actionRegister[$this->idActiveAction]['failed']))
            $this->eventAction(self::$actionRegister[$this->idActiveAction]['failed'], $e);
    }

    private function eventAction($eventAction, $e = null) {
        $this->initXmlAspect();
        foreach ($eventAction as $eventAspect) {
            $aspectName = $eventAspect['name'];
            $aspect = self::$xmlAspect->$aspectName;
            if (!isset($aspect)) {
                if (self::AOP_EXCEPTION_ACTIVE)
                    throw new ZendExt_Exception('WEAVER03');
            }
            elseif ($aspect['active'] == 'true') {
                $class = (string) $aspect->class['name'];
                if (isset($class) && class_exists($class)) {
                    $method = (string) $aspect->class->method['name'];
                    if ($aspect->class->method['static'] == 'false') {
                        if ($aspect->class['singlenton'] == 'true') {
                            try {
                                $objAspect = call_user_func(array($class, 'getInstance'));
                            } catch (Exception $e) {
                                throw new ZendExt_Exception('WEAVER04', $e);
                            }
                        }
                        else
                            $objAspect = new $class();
                        if (method_exists($objAspect, $method)) {
                            if (isset($aspect->class->method['idXML'])) {
                                $xmlAspectConcretAction = $this->getXMLAspectConcret((string) $aspect->class->method['idXML']);
                                if ($e == null)
                                    $objAspect->$method($xmlAspectConcretAction);
                                else
                                    $objAspect->$method($xmlAspectConcretAction, $e);
                            }
                            elseif ($e == null)
                                $objAspect->$method();
                            else
                                $objAspect->$method($e);
                        }
                        else
                            throw new ZendExt_Exception('WEAVER05', $e);
                    }
                    else {
                        $module = self::$module;
                        try {
                            if (isset($aspect->class->method['idXML'])) {
                                $xmlAspectConcretAction = $this->getXMLAspectConcret((string) $aspect->class->method['idXML']);
                                if ($e == null)
                                    call_user_func(array($class, $method), $xmlAspectConcretAction);
                                else
                                    call_user_func(array($class, $method), $xmlAspectConcretAction, $e);
                            }
                            elseif ($e == null)
                                call_user_func(array($class, $method));
                            else
                                call_user_func(array($class, $method), $e);
                        } catch (Exception $e) {
                            throw new ZendExt_Exception('WEAVER05', $e);
                        }
                    }
                }
                else
                    throw new ZendExt_Exception('WEAVER06');
            }
        }
    }

    private function getXMLAspectConcret($idXML) {
        $xmlAspectConcret = ZendExt_FastResponse::getXML($idXML);
        $tempXmlElementAspectConcret = $xmlAspectConcret;
        foreach ($this->property as $property) {
            $tempXmlElementAspectConcret = $tempXmlElementAspectConcret->$property;
        }
        return $tempXmlElementAspectConcret;
    }

}
