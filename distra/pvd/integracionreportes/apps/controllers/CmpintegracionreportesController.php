<?php

/**
 * @copyright UCID, ERP-CUBA
 */
class CmpintegracionreportesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista importar.phtml
     */
    function cmpintegracionreportesAction()
    {
        $this->render();
    }

    function listarReportesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['sort'] = $this->_request->getPost('sort');
        $parametros['dir'] = $this->_request->getPost('dir');
        $start = $this->_request->getPost('start');
        $parametros['start'] = (empty($start) || !is_numeric($start)) ? 0 : $start;
        $limit = $this->_request->getPost('limit');
        $parametros['limit'] = empty($limit) ? 100 : $limit;

        $reportes = new DatReporteModel();
        $result = $reportes->listarReportes($parametros);
        if (isset($result['data'][0])) echo json_encode($result);
        else echo json_encode(array('total' => 0, 'data' => array()));
    }


    function adicionarReporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacionreporte');
        $parametros['denreporte'] = str_ireplace('"', "'", $denelemento);
        $parametros['descreporte'] = $this->_request->getPost('hedescripcion');
        $parametros['idreportereportserver'] = $this->_request->getPost('tfidreportserver');
        $parametros['idconfiguracion'] = $this->_request->getPost('idconfiguracion');
        $parametros['idclasificacion'] = $this->_request->getPost('idclasificacion');
        $parametros['arrayfiltros'] = json_decode(
            stripslashes($this->_request->getPost('arrayfiltros')));
        $objreportemodel = new DatReporteModel();
        $result = $objreportemodel->adicionarReporte($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function modificarReporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacionreporte');
        $parametros['denreporte'] = str_ireplace('"', "'", $denelemento);
        $parametros['descreporte'] = $this->_request->getPost('hedescripcion');
        $parametros['idreportereportserver'] = $this->_request->getPost('tfidreportserver');
        $parametros['idconfiguracion'] = $this->_request->getPost('idconfiguracion');
        $parametros['idclasificacion'] = $this->_request->getPost('idclasificacion');
        $parametros['idreporte'] = $this->_request->getPost('idreporte');

        $objreportemodel = new DatReporteModel();
        $result = $objreportemodel->modificarReporte($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function eliminarReporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidreportes = json_decode(
            stripslashes($this->_request->getPost('arrayidreportes'))
        );
        $objreportemodel = new DatReporteModel();
        $result = $objreportemodel->eliminarReporte($arrayidreportes);
        echo json_encode(array('mensaje' => $result));
    }

    function cargarFormularioReporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idreporte = $this->_request->getPost('idreporte');
        $objreportemodel = new DatReporteModel();
        $result = $objreportemodel->obtenerReporteDadoIdSql($idreporte);
        if (isset($result[0])) {
            $dat [] = array(
                'idreporte' => $result[0]['idreporte'],
                'denreporte' => $result[0]['denreporte'],
                'idconfiguracion' => $result[0]['idconfiguracion'],
                'idreportereportserver' => $result[0]['idreportereportserver'],
                'descreporte' => $result[0]['descreporte'],
                'denconfiguracion' => $result[0]['denconfiguracion'],
                'idclasificacion' => $result[0]['idclasificacion'],
                'denclasificacion' => $result[0]['denclasificacion']
            );
            echo json_encode(array('data' => $dat, 'mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

    function cargarFormularioReporteOldAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idreporte = $this->_request->getPost('idreporte');
        $objreportemodel = new DatReporteModel();
        $result = $objreportemodel->obtenerReporteDadoId($idreporte);
        if (is_array($result)) {
            $dat [] = array(
                'idreporte' => $result['idreporte'],
                'denreporte' => $result['denreporte'],
                'idconfiguracion' => $result['idconfiguracion'],
                'idreportereportserver' => $result['idreportereportserver'],
                'descreporte' => $result['descreporte'],
                'denconfiguracion' => $result['NomConfiguracionReporte']['denconfiguracion']
            );
            echo json_encode(array('data' => $dat, 'mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

    function obtenerUrlReporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params['idreporte'] = $this->_request->getPost('idreporte');
        $params['formatoreporte'] = $this->_request->getPost('formatoreporte');
        $params['idestructura'] = $this->_request->getPost('idestructura');
        $params['datosfiltros'] = json_decode(
            stripslashes($this->_request->getPost('datosfiltros'))
        );
        $objconfmodel = new NomConfiguracionReporteModel();
        $result = $objconfmodel->obtenerDatosConfiguracionReporte($params);
        if (isset($result['config']['id'])) {
            $reportserver = new ReportServer();
            $result['usuario'] = $this->global->Perfil->usuario;
            $url = $reportserver->getURL($result);
            echo json_encode(array('url' => $url, 'mensaje' => 1, 'formatoreporte' => $params['formatoreporte']));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

    function obtenerUrlReporteOldAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params['idreporte'] = $this->_request->getPost('idreporte');
        $params['formatoreporte'] = $this->_request->getPost('formatoreporte');
        $params['datosfiltros'] = json_decode(
            stripslashes($this->_request->getPost('datosfiltros'))
        );
        $objconfmodel = new NomConfiguracionReporteModel();
        $result = $objconfmodel->obtenerDatosConfiguracionReporte($params);
        if (isset($result['id'])) {
            $formatoreporte = $params['formatoreporte'];
            $data = array(
                'formatoreporte' => $formatoreporte,
                'idreportereportserver' => $result['idreportereportserver'],
                'usuario' => $result['NomConfiguracionReporte']['usuario'],
                'apikey' => $result['NomConfiguracionReporte']['apikey'],
                'urlservidor' => $result['NomConfiguracionReporte']['urlservidor']
            );
            $url = self::crearUrlReporte($data);
            echo json_encode(array('url' => $url, 'mensaje' => 1, 'formatoreporte' => $formatoreporte));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

    function crearUrlReporte($parametros)
    {
        extract($parametros);
        $url = '';
        if ($formatoreporte == 'vistaprevia') {
            $url = $urlservidor . '/ReportServer.html#inlinereport/id:' . $idreportereportserver . '&type:preview';
        } elseif (!empty($apikey)) {
            $url = $urlservidor . '/reportserver/httpauthexport?id=' . $idreportereportserver . '&user=' . $usuario . '&apikey=' . $apikey . '&format=' . $formatoreporte . '&download=false';
        } else $url = $urlservidor . '/reportserver/reportexport?id=' . $idreportereportserver . '&format=' . $formatoreporte;
        return $url;
    }


}
