<?php


class MediosPendientesModel extends ZendExt_Model
{
    private $ordenTrabajoService;

    public function __construct()
    {
        parent::__construct();
        $this->ordenTrabajoService = new OrdenTrabajoTalleresService();
    }

    public function getMediosPendientes($param)
    {
        $data = array();
        $i = 0;
        $param['estadoorden'] = 1;
        $ordenes = $this->ordenTrabajoService->devolverOrdenesTrabajo($param, false);
        foreach ($ordenes['datos'] as $field) {
            $data[$i]['nrodoc'] = $field['nrodoc'];
            $data[$i]['producto'] = $field['descripcionmarcamodelo'];
            $data[$i]['marca'] = $field['marca'];
            $data[$i]['modelo'] = $field['modelo'];
            $data[$i]['atributoidentificador'] = $field['atributoidentificador'];
            $result = $this->materialesPendientes($field['idordentrabajo']);
            $data[$i]['piezas'] = $result;
            $i++;
        }
        return array('cantidad' => count($data), 'datos' => $data);
    }


    public function materialesPendientes($param)
    {
        $data = array();
        $result = $this->ordenTrabajoService->devolverMaterialesOrden($param);
        foreach ($result['datos'] as $row) {
            if ($row['estado'] == 1) {
                array_push($data, $row['denominacion']);
            }
        }
        return $data;
    }


}