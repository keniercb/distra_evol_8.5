<?php

class PiezasRecuperadasModel extends ZendExt_Model
{
    private $_ordenTrabajoService;

    public function __construct()
    {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
    }

    public function obtenerPiezasRetiradas($params)
    {
        return $this->_ordenTrabajoService->cargarPiezasRetiradas($params);
    }

    public function obtenerPadresPiezasRetiradas($params)
    {
        $params['indicadores'] = true;
        return $this->_ordenTrabajoService->cargarIndicadoresPiezasRetiradas($params);
    }

    public function obtenerPiezasRetiradasGeneral($params)
    {
        return $this->_ordenTrabajoService->cargarCantidaPiezasRetiradasPorIndicador($params);
    }

    public function crearExcel($params)
    {
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        if ($params['piezas'] == 'especificas') {
            $datos = $this->obtenerPiezasRetiradas($params);
            $params['columns'] = Zend_Json::decode($params['columns']);
            $columns =
                array('No. orden', 'Identificador', 'Pieza', 'Marca', 'Modelo', 'Motivo', 'Destino', 'Vida útil');
            if ($params['columns']) {
                foreach ($params['columns'] as $p) {
                    $columns[] = $p['etiqueta'];
                }
            }
            $excel->writeLine($columns);
            foreach ($datos['datos'] as $d) {
                $name = Zend_Json::decode($d['datos']);
                $campodinamico = ($name[0]['name'] == 'marca') ? $name[0]['name'] : '';
                $excel->writeRow();
                $excel->writeCol($d['nrodoc']);
                $excel->writeCol($d['atributoidentificador']);
                $excel->writeCol($d['denominacion']);
                $excel->writeCol($name[0][$campodinamico]);
                $excel->writeCol($d['modelo']);
                $excel->writeCol($d['motivo']);
                $excel->writeCol($d['destino']);
                $excel->writeCol($d['vidautil']);
                if ($params['columns']) {
                    foreach (Zend_Json::decode($d['datos']) as $din) {
                        $excel->writeCol($din[$din['name']]);
                    }
                }
            }
        } else {
            if ($params['piezas'] == 'generales') {
                $datos = $this->obtenerPiezasRetiradasGeneral($params);
                $params['columns'] = Zend_Json::decode($params['columns']);
                $columns = array('Pieza', 'Marca', 'Modelo', 'Cantidad de veces retirada');
                if ($params['columns']) {
                    foreach ($params['columns'] as $p) {
                        $columns[] = $p['etiqueta'];
                    }
                }
                $excel->writeLine($columns);
                foreach ($datos['datos'] as $d) {
                    $name = Zend_Json::decode($d['datos']);
                    $campodinamico = ($name[0]['name'] == 'marca') ? $name[0]['name'] : '';
                    $excel->writeRow();
                    $excel->writeCol($d['denominacion']);
                    $excel->writeCol($name[0][$campodinamico]);
                    $excel->writeCol($d['modelo']);
                    $excel->writeCol($d['cantidad']);
                    if ($params['columns']) {
                        foreach (Zend_Json::decode($d['datos']) as $din) {
                            $excel->writeCol($din[$din['name']]);
                        }
                    }
                }
            }
        }
        $excel->close();
        return '/logistica/talleres/recuperaciones/' . $fichero;
    }

}