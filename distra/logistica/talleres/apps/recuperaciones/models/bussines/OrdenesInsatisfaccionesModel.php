<?php


class OrdenesInsatisfaccionesModel extends ZendExt_Model
{
    private $_ordenTrabajoService;

    public function __construct()
    {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
    }

    public function getOrdenesInsatisfacciones($params)
    {
        $ordenService = new OrdenTrabajoTalleresService();
        $fechainicio = ($params['fechainicio']) ? $params['fechainicio'] : null;
        $fechafin = ($params['fechaentrega']) ? $params['fechaentrega'] : null;
        unset($params['fechainicio']);
        unset($params['fechaentrega']);
        $dql = $ordenService->devolverOrdenesTrabajo($params, true);
        $dql->addWhere("ord.cantidadreclamaciones > 0");
        if ($fechainicio) {
            $dql->addWhere("rec.fechareclamacion >= ? ", array($fechainicio));
        };
        if ($fechafin) {
            $dql->addWhere("rec.fechareclamacion <= ? ", array($fechafin));
        };
        $dql->orderBy("ord.cantidadreclamaciones desc");
        $result = $dql->fetchArray();
        $data = array();
        $i = 0;
        foreach ($result as $field) {
            $data[$i]['nroorden'] = ($field['nrodoc']) ? $field['nrodoc'] : $field['numeroref'];
            $data[$i]['cantidadreclamaciones'] = $field['cantidadreclamaciones'];
            $data[$i]['medio'] = $field['descripcionmarcamodelo'];
            $data[$i]['marca'] = $field['marca'];
            $data[$i]['modelo'] = $field['modelo'];
            $data[$i]['atributoidentificador'] = $field['atributoidentificador'];
            $recla = $this->_ordenTrabajoService->cargarReclamacionesOrden($field)['datos'];
            foreach ($recla as $obj) {
                $data[$i]['reclamaciones'][] = $obj['descripcion'];
            }
            $i++;
        }
        return array('cantidad' => count($data), 'datos' => $data);
    }

}
