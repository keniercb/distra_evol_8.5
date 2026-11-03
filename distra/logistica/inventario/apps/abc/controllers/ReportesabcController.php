<?php

class ReportesabcController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function reportesabcAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function obtenerreportesAction()
    {
        $r = array();
        $r[] = array('id' => 1, 'text' => 'Listado de productos a solicitar', 'leaf' => true, 'idreporte' => 254592, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 2, 'text' => 'Estadísticas de productos a solicitar', 'leaf' => true, 'idreporte' => 254586, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 3, 'text' => 'Listado de productos en déficit', 'leaf' => true, 'idreporte' => 253923, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 4, 'text' => 'Estadísticas de productos en déficit', 'leaf' => true, 'idreporte' => 253919, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 5, 'text' => 'Listado de productos en ruptura de stock', 'leaf' => true, 'idreporte' => 255214, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 6, 'text' => 'Estadísticas de productos en ruptura de stock', 'leaf' => true, 'idreporte' => 255232, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 7, 'text' => 'Listado de productos por encima de su máximo', 'leaf' => true, 'idreporte' => 255735, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 8, 'text' => 'Estadísticas de productos por encima de su máximo', 'leaf' => true, 'idreporte' => 255751, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 9, 'text' => 'Listado de ABC calidad del inventario', 'leaf' => true, 'idreporte' => 256744, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        $r[] = array('id' => 10, 'text' => 'Estadísticas de ABC calidad del inventario', 'leaf' => true, 'idreporte' => 256740, 'servidor' => 'https://reporte.sasa.co.cu/reportserver');
        echo json_encode($r);
    }

    public function visualizarreporteAction()
    {
        $servidor = "127.0.0.1:8080";
        $idreporte = $this->_request->getPost('tipo');
        $url = "http://{$servidor}/ReportServer.html#inlinereport/id:".
            $idreporte.
            "&type:configpreview&user:root&apikey:1QaZ2WsX3EdC4RfV5tGB";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $r = curl_exec($ch);
        curl_close($ch);

        echo json_encode($r);

    }

}