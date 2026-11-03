<?php

class ReporteMrg
{
    public function getP3_Altas_Bajas()
    {
        $objReport = new P3AltasyBajas();
        $objDomain = new SituacionLaboralRepository();
        $objReport->crearReporte();
        $objReport->crearTabla($objDomain->getPersonaEntidadRegistros());
        $objReport->save();
    }

    public function getP4_RegistroTrabajadores()
    {
        $objReport = new P4RegistroTrabajadores();
        $objModel = new DatSituacionModel();
        $objNominaService = new NominaPersonaService();
        $data = $objModel->getPersonasConSituacionLaboral();
        $datosnominales = array();
        foreach ($data->data as $k => $v) {
            $data->data[$k]['foto'] = '';
            $data->data[$k]['salario'] = array();
            if (!empty($v['idcargo'])) {
                $datosn = $objNominaService->ObtenerDatosNominaPersona($v['idcargo'], $v['idpersona'], $v['identidad']);
                if (!isset($datosn->codigo)) {
                    foreach ($datosn as $valor => $val) {
                        $datosnominales[$valor]['denominacion'] = $val;
                        //Inserto los valores nominales al arreglo de datos del reporte
                        $data->data[$k]['salario'][$valor] = (String)$val;
                        //Sumarar el total de todos los conceptos nominales
                        $data->data[$k]['total'] += $val;
                    }
                }
            }
        }
        $objReport->crearReporte();
        $objReport->crearTabla($data, $datosnominales);
        $objReport->save();
    }
}