<?php

class ConfigurarController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent:: init();
    }
    function configurarAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }
    function cargarAction()
    {
        $xml = ZendExt_FastResponse::getXML('traceconfig');
        $data = array();
        foreach ($xml->containers->children() as $trace) {
            $item->traza = (string)$trace['alias'];
            $item->activado = (string)$trace['enabled'] == '1';
            $data[] = $item;
            $item = null;
        }
        $json->data = $data;
        echo json_encode($json);
    }

    function cambiarAction()
    {
        $trace = $this->_request->getPost('traza');
        $enabled = (int)($this->_request->getPost('activado') == 'true');
        $xml = ZendExt_FastResponse:: getXML('traceconfig');
        foreach ($xml->containers->children() as $container) {
            if ((string)$container ['alias'] == $trace) {
                $container['enabled'] = (int)!$enabled;
                $path = Zend_Registry:: getInstance()->config->xml->traceconfig;
                file_put_contents($path, $xml->asXml());
                break;
            }
        }
        if ((int)!$enabled) {
            $r->cod = 1;
            $r->mensaje = "La traza ha sido activada satisfactoriamente.";
        } else {
            $r->cod = 1;
            $r->mensaje = "La traza ha sido desactivada satisfactoriamente.";
        }
        echo(json_encode($r));
    }
    function testAction()
    {
        $file = new ZendExt_File('/tmp/test');
        $file->cp('/var/www/test/a/a.txt', '/var/www/test/b');
    }
}

