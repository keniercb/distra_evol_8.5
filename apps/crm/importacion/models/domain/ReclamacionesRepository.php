<?php

/**
 * ReclamacionesRepository
 *
 * @package    Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright  UCID
 * @version    1.0
 */
class ReclamacionesRepository extends BaseRepository
{
    public function __construct()
    {
        $filters = array(
            'equalIdReclamacion' => array('statement' => 'r.idreclamacion = ?')
        );
        parent::__construct('Reclamaciones', 'r', 'idreclamacion', $filters);
    }

    public function getReclamaciones($params)
    {
        $sqlReclamaciones = $this->getSqlReclamaciones();
        $sqlEstado = $this->getSqlEstado();
//        print_r($sqlEstado);die;
        $sqlFilters = $this->getSqlFilters($params);

        $query = 'SELECT ' . $sqlReclamaciones['select'] . ', '
            . $sqlEstado['select'] . ' ' . $sqlReclamaciones['join'] . ' '
            . $sqlEstado['join'];
        $queryCount = $sqlReclamaciones['join'] . ' ' . $sqlEstado['join'];
//        print_r($query);die;
        if ($sqlFilters[0]) {
            $query .= $sqlFilters[0];
            $queryCount .= $sqlFilters[0];
        }
        if ($sqlFilters[1]) {
            $query = "SELECT * FROM (" . $query . ") r WHERE " . $sqlFilters[1];
            $queryCount = " FROM (" . $sqlReclamaciones['select'] . ' ' . " "
                . $queryCount . ")
             r WHERE " . $sqlFilters[1];
        }
        $ordenar = 'ORDER BY r.idreclamacion DESC';
        if ($params['sorters']) {
            $ordenar = 'ORDER BY ';
            foreach (json_decode($params['sorters']) as $sort) {
                $ordenar = $ordenar . $sort->property . ' ' . $sort->direction
                    . ',';
            }
            $ordenar = trim($ordenar, ',');
        }
        $query = $query . ' ' . $ordenar;
        if (array_key_exists('limit', $params)) {
            $start = $params['start'] ? $params['start'] : 0;
            $query .= '  LIMIT ' . $params['limit'] . " OFFSET " . $start;
        }
//print_r($query);die;
        try {
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
//            print_r( $query);die;
            return array(
                'cant'  => $conn->fetchAll(
                    'SELECT count(*) ' . $queryCount
                )[0]['count'],
                'datos' => $conn->fetchAll($query),
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getSqlReclamaciones()
    {
        return array('select' => 'r.nombre as nombre, r.idreclamacion , r.tipo,r.idespaciotrabajo, r.numero as numero, r.fecha as fecha,r.motivo as motivo, 
                                    r.pretension, r.fundamentacionlegal, tl.denominacion as tipolinea, tl.idtipolinea, 
                                    tr.nombre as tiporeclamacion, tr.idtiporeclamacion, c.nombre as cliente, c.idclientesproveedores,
                                     p.nombre as proveedor,p.idclientesproveedores, i.denominacion as linea, i.idindicador,
                                     cont.nombre as contrato, cont.idcontrato, r.idcliente, r.idproveedor',
                     'join'   => "FROM mod_crmcontratacion.dat_reclamaciones r
                        LEFT JOIN mod_crmcontratacion.nom_tipolinea tl ON (tl.idtipolinea=r.idtipolinea)
                        LEFT JOIN mod_crmcontratacion.nom_tiporeclamacion tr ON (tr.idtiporeclamacion=r.idtiporeclamacion)
                        LEFT JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador=r.idlinea)
                        LEFT JOIN mod_datosmaestros.nom_clientesproveedor c ON (c.idclientesproveedores=r.idcliente)
                        LEFT JOIN mod_datosmaestros.nom_clientesproveedor p ON (p.idclientesproveedores=r.idproveedor)
                        LEFT JOIN mod_crmcontratacion.dat_contrato cont ON (cont.idcontrato=r.idcontrato)
                        "
        );
    }

    private function getSqlEstado()
    {
        return array(
            'select' => 'ne.idestado as idestado, ne.nombre as estado, ne.icono as iconoestado,re.fechainicio as fechaestado',
            'join'   => "LEFT JOIN mod_crmcontratacion.dat_reclamacionestado re ON re.idreclamacion = r.idreclamacion and re.fechafin is null
                    LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = re.idestado"
        );
    }

    private function getSqlFilters($filters)
    {
        $sqlFilter = array();
        $filterExtra = array();
        foreach ($filters['filters'] as $val) {
            $type = $val['data']['type'];
            $value = $val['data']['value'];
            if ($value && !is_null($value)) {

                if ($val['field'] == 'general') {
                    array_push($sqlFilter, "r.nombre ILIKE '%" . $value . "%'");
                } else {
                    if ($val['field'] == 'nombre') {
                        array_push(
                            $sqlFilter, "r.nombre ilike '%" . $value . "%'"
                        );
                    }
//                else if ($val['field'] == 'fecha') {
//                                array_push($sqlFilter,"r.fecha ilike ' % " . $value . " % '");
//                            }
                    else {
                        if ($val['field'] == 'proveedor') {
                            array_push(
                                $sqlFilter, "p.nombre ilike '%" . $value . "%'"
                            );
                        } else {
                            if ($val['field'] == 'cliente') {
                                array_push(
                                    $sqlFilter,
                                    "c.nombre ilike '%" . $value . "%'"
                                );
                            } else {
                                if ($val['field'] == 'linea') {
                                    array_push(
                                        $sqlFilter,
                                        "i.denominacion ilike '%" . $value
                                        . "%'"
                                    );
                                } else {
                                    if ($val['field'] == 'tipolinea') {
                                        array_push(
                                            $sqlFilter,
                                            "tl.denominacion ilike '%" . $value
                                            . "%'"
                                        );
                                    } else {
                                        if ($val['field']
                                            == 'tiporeclamacion'
                                        ) {
                                            array_push(
                                                $sqlFilter,
                                                "tr.nombre ilike '%" . $value
                                                . "%'"
                                            );
                                        } else {
                                            if ($val['field'] == 'contrato') {
                                                array_push(
                                                    $sqlFilter,
                                                    "cont.nombre ilike '%"
                                                    . $value . "%'"
                                                );
                                            } else {
                                                if ($val['field'] == 'motivo') {
                                                    array_push(
                                                        $sqlFilter,
                                                        "r . motivo ilike '%"
                                                        . $value . "%'"
                                                    );
                                                } else {
                                                    if ($val['field']
                                                        == 'pretension'
                                                    ) {
                                                        array_push(
                                                            $sqlFilter,
                                                            "r . pretension ilike '%"
                                                            . $value . "%'"
                                                        );
                                                    } else {
                                                        if ($val['field']
                                                            == 'fundamentacionlegal'
                                                        ) {
                                                            array_push(
                                                                $sqlFilter,
                                                                "r . fundamentacionlegal ilike '%"
                                                                . $value . "%'"
                                                            );
                                                        } else {
                                                            if ($val['field']
                                                                == 'numero'
                                                            ) {
                                                                array_push(
                                                                    $sqlFilter,
                                                                    "r . numero ilike '%"
                                                                    . $value
                                                                    . "%'"
                                                                );
                                                            } else {
                                                                if ($val['field']
                                                                    == 'estado'
                                                                ) {
                                                                    array_push(
                                                                        $sqlFilter,
                                                                        $this->getFilterList(
                                                                            're.idestado',
                                                                            $value
                                                                        )
                                                                    );
                                                                } else {
                                                                    if ($val['field']
                                                                        == 'idestado'
                                                                    ) {
                                                                        $idsestado
                                                                            = is_array(
                                                                            $value
                                                                        )
                                                                            ? $value
                                                                            : array($value);

                                                                        array_push(
                                                                            $sqlFilter,
                                                                            're.idestado in ('
                                                                            . implode(
                                                                                ',',
                                                                                $idsestado
                                                                            )
                                                                            . ')'
                                                                        );
                                                                    } else {
                                                                        if ($type
                                                                            == 'date'
                                                                        ) {
                                                                            $field
                                                                                = $val['field'];
                                                                            array_push(
                                                                                $sqlFilter,
                                                                                $this->getFilterDate(
                                                                                    $field,
                                                                                    $value,
                                                                                    $val['data']['comparison']
                                                                                )
                                                                            );
                                                                        }
                                                                        else{
                                                                            if($val['field']== 'tipo'){
                                                                                $value = json_decode($value);
                                                                                $idtipo = is_array($value) ? $value: array($value);
                                                                                array_push($sqlFilter,'r.tipo in ('. implode(',', $idtipo) . ')');
                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $result = implode(" and ", $sqlFilter);
        if (!empty($result)) {
            $result = ' WHERE ' . $result;
        }

        $result2 = implode(' and ', $filterExtra);
        return array($result, $result2);
    }


    private
    function getFilterList($field, $value
    ) {
        $value = json_decode($value);
        if (is_array($value) && count($value) > 0) {
            $value = implode(',', $value);
        }
        return $field . " IN (" . $value . ")";
    }

    private
    function getFilterDate($field, $value, $comparison
    ) {
        if ($comparison == 'lt') {
            return $field . " < '" . $value . "'";
        }
        if ($comparison == 'gt') {
            return $field . " > '" . $value . "'";
        }
        if ($comparison == 'eq') {
            return $field . " = '" . $value . "'";
        }
        if ($comparison == 'in') {
            return $field . " ISNULL";
        }
        if ($comparison == 'nn') {
            return $field . " NOTNULL";
        }
    }

    private
    function getFilterNumeric($field, $value, $comparison
    ) {
        $value = !is_array($value) ? json_decode($value) : $value;
        if ($comparison == 'lt') {
            return $field . " < " . $value;
        }
        if ($comparison == 'gt') {
            return $field . " > " . $value;
        }
        if ($comparison == 'di') {
            return $field . " <> " . $value;
        }
        if (is_array($value)) {
            return $field . " in( " . implode(' , ', $value) . ")";
        } else {
            return $field . " = " . $value;
        }
    }

    public
    function insertRecord($arrayData = array()
    ) {
        try {
            $result = $this->createRecord($arrayData);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }

    }

    protected
    function createRecord($arrayData = array()
    ) {
        try {
            $objectModel = new DatReclamaciones();
            $objectModel->fromArray($arrayData);
            $objectModel->save();
            return $objectModel->idreclamacion;
        } catch (Exception $e) {
            throw $e;
        }
    }

}