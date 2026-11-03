<?php

/**
 * @name CaptchaController - Clase controladora del 
 * componente de configuracion del captcha.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class CaptchaController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @method captchaAction()
     *
     * @return void
     */
    public function captchaAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * Función encargada de guardar las configuraciones en el fichero .ini
     */
    public function saveConfigAction()
    {
        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini(
            $register->config->security_config, null, $array
        );
        if ($this->_request->getPost('isEnabled') != "") {
            $font = $this->_request->getPost('factive');
            if (strpos($this->_request->getPost('factive'), '.ttf') === false) {
                $font = self::getFont($this->_request->getPost('factive'));
            }
            $config->captcha->timeout = $this->_request->getPost('texpiracion');
            $config->captcha->wordLen = $this->_request->getPost('wordlength');
            $config->captcha->dotNoiseLevel = $this->_request->getPost(
                'DotNoiseLevel'
            );
            $config->captcha->lineNoiseLevel = $this->_request->getPost(
                'LineNoiseLevel'
            );
            $config->captcha->bgColor = $this->_request->getPost(
                'backgroundColor'
            );
            $config->captcha->textColor = $this->_request->getPost('textColor');
            $config->captcha->fontSize = $this->_request->getPost('FontSize');
            $config->captcha->activeFont = $font;
            $config->captcha->lineNoiseColor = $this->_request->getPost(
                'lineNoiseColor'
            );
            $config->captcha->dotNoiseColor = $this->_request->getPost(
                'dotNoiseColor'
            );
            $config->captcha->enabled = $this->_request->getPost('isEnabled');
        } else {
            $config->captcha->enabled = "off";
        }
        $arrayFile = array(
            'config' => $config, 
            'filename' => $register->config->security_config
        );
        $writer = new Zend_Config_Writer_Ini($arrayFile);
        $writer->write();
        $this->showMessage('El captcha ha sido modificado satisfactoriamente');
    }

    /**
     * Función encargada de cargar 
     * las configuraciones del captcha en el fichero .ini
     */
    public function loadConfigAction()
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'captcha'
        );
        $array = array('datos' => array(array(
                    'texpiracion' => $config->timeout,
                    'factive' => ucwords(basename($config->activeFont, '.ttf')),
                    'wordlength' => $config->wordLen,
                    'backgroundColor' => $config->bgColor,
                    'textColor' => $config->textColor,
                    'DotNoiseLevel' => $config->dotNoiseLevel,
                    'LineNoiseLevel' => $config->lineNoiseLevel,
                    'FontSize' => $config->fontSize,
                    'lineNoiseColor' => $config->lineNoiseColor,
                    'isEnabled' => $config->enabled,
                    'dotNoiseColor' => $config->dotNoiseColor)));
        echo json_encode($array);
    }

    /**
     * Función encargada de generar imagenes a medida 
     * que se vayan cambiando las
     * configuraciones en la interfaz
     */
    public function generateAction()
    {
        $font = $this->_request->getPost('factive');
        if (strpos($this->_request->getPost('factive'), '.ttf') === false) {
            $font = self::getFont($this->_request->getPost('factive'));
        }
        $register = Zend_Registry::getInstance();
        $configColor = new Zend_Config_Ini(
            $register->config->security_config, 'color'
        );
        $dotNoiseColor = $this->_request->getPost('dotNoiseColor');
        $lineNoiseColor = $this->_request->getPost('lineNoiseColor');
        $backgroundColor = $this->_request->getPost('backgroundColor');
        $textColor = $this->_request->getPost('textColor');
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'captcha'
        );
        $captcha = new ZendExt_Captcha_Image();
        $captcha->setTimeout($this->_request->getPost('texpiracion'));
        $captcha->setWordLen($this->_request->getPost('wordlength'));
        $captcha->setDotNoiseColor($configColor->$dotNoiseColor);
        $captcha->setLineNoiseColor($configColor->$lineNoiseColor);
        $captcha->setBgColor($configColor->$backgroundColor);
        $captcha->setTextColor($configColor->$textColor);
        $captcha->setWidth($config->width);
        $captcha->setDotNoiseLevel($this->_request->getPost('DotNoiseLevel'));
        $captcha->setLineNoiseLevel($this->_request->getPost('LineNoiseLevel'));
        $captcha->setHeight($config->height);
        $captcha->setFont($_SERVER['DOCUMENT_ROOT'] . $config->dirFont . $font);
        $captcha->setFontSize($this->_request->getPost('FontSize'));
        $captcha->setImgDir($_SERVER['DOCUMENT_ROOT'] . $config->dirCaptcha);
        $captcha->generate();
        echo json_encode(array('datos' => $captcha->getId()));
    }

    /**
     * Funcion usada para cargar el listado de fuentes.
     */
    public function loadFontAction()
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'captcha'
        );
        $handle = opendir($_SERVER['DOCUMENT_ROOT'] . $config->dirFont);
        $index = 0;
        $result = array();

        while ($tmp = readdir($handle)) {
            if ($tmp != '.' && $tmp != '..' && strpos($tmp, '.ttf') != false) {
                $fontName = ucwords(basename($tmp, '.ttf'));
                $result[$index]['factive'] = $fontName;
                $result[$index]['value'] = $tmp;
                $index++;
            }
        }

        echo json_encode(array('datos' => $result));
    }

    /**
     * Funcion usada para cargar el listado de colores de lineas.
     */
    public function loadLineColorAction()
    {              
        echo json_encode(
            array('datos' => $this->getKeysResult('lineNoiseColor'))
        );
    }

    /**
     * Funcion usada para cargar el listado de colores de fondo.
     */
    public function loadBackgroundColorAction()
    {
        echo json_encode(
            array('datos' => $this->getKeysResult('backgroundColor'))
        );
    }

    /**
     * Funcion usada para cargar el listado de colores del texto.
     */
    public function loadTextColorAction()
    {
        echo json_encode(
            array('datos' => $this->getKeysResult('textColor'))
        );
    }

    /**
     * Funcion usada para cargar el listado de colores de los puntos.
     */
    public function loadDotColorAction()
    {
        echo json_encode(
            array('datos' => $this->getKeysResult('dotNoiseColor'))
        );
    }
    private function getKeysResult($keyReference)
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'color'
        );
        $result = array();
        $index = 0;  
        $keys=array_keys($config->toArray());        
        foreach ($keys as $key) {
            $result[$index][$keyReference] = $key;
            $index++;
        }  
        return $result;
    }

    private static function getFont($fontName)
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'captcha'
        );
        $dirCptcha = $config->dirFont;
        $handle = opendir('../../web' . $dirCptcha);
        while ($tmp = readdir($handle)) {
            if (ucwords(basename($tmp, '.ttf')) == $fontName) {
                return$tmp;
            }
        }
    }

}
