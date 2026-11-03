<?php

/**
 * PenalizacionesRepository
 *
 * @package    Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright  UCID
 * @version    1.0
 */
class PenalizacionesRepository extends BaseRepository
{
    public function __construct()
    {
        $filters = array(
            'equalIdPenalizacion' => array('statement' => 'p.idpenalidad = ?')
        );
        parent::__construct('Penalizaciones', 'p', 'idpenalidad', $filters);
    }

    public function getPenalizaciones($params)
    {
//        print_r($params);die;
        $sqlPenalizaciones = $this->getSqlPenalizaciones();
        $sqlEstado = $this->getSqlEstado();
        $sqlFilters = $this->getSqlFilters($params);

        $query = 'SELECT ' . $sqlPenalizaciones['select'] . ', '
            . $sqlEstado['select'] . ' ' . $sqlPenalizaciones['join'] . ' '
            . $sqlEstado['join'];
//        print_r($query);die;
        $queryCount = $sqlPenalizaciones['join'] . ' ' . $sqlEstado['join'];
        if ($sqlFilters[0]) {
            $query .= $sqlFilters[0];
            $queryCount .= $sqlFilters[0];
        }
        if ($sqlFilters[1]) {
            $query = "SELECT * FROM (" . $query . ") p WHERE " . $sqlFilters[1];
            $queryCount = " FROM (" . $sqlPenalizaciones['select'] . ' '
                . $queryCount . ")
             p WHERE " . $sqlFilters[1];
        }
        $ordenar = 'ORDER BY p.idpenalidad DESC';
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
        try {
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

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

    private function getSqlPenalizaciones()
    {
        return array('select' => 'p.idtipopenalidad, p.idpenalidad,p.idarribo, p.descripcion, a.idcontrato,
                                  c.numero,c.nombre as contrato, c.denominacionclienteproveedor AS clienteproveedor,
                                  a.descripcion as arribo,tp.nombre as tipopenalidad,tp.porciento',
                     'join'   => "FROM mod_crmcontratacion.dat_penalizaciones p
                                  LEFT JOIN mod_crmcontratacion.dat_arribo a on (a.idarribo= p.idarribo)
                                  LEFT JOIN mod_crmcontratacion.dat_contrato c on (c.idcontrato= a.idcontrato)
                                  LEFT JOIN mod_crmcontratacion.nom_tipopenalidad tp on (tp.idtipopenalidad= p.idtipopenalidad)"
        );
    }
    private function getSqlEstado()
    {
        return array(
            'select' => 'ne.idestado as idestado, ne.nombre as estado, ne.icono as iconoestado,pe.fechainicio as fechaestado',
            'join'   => "LEFT JOIN mod_crmcontratacion.dat_penalizacionestado pe ON pe.idpenalidad = p.idpenalidad and pe.fechafin is null
                    LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = pe.idestado"
        );
    }

    private function getSqlCliente()
    {

        return array(
            'select' => "(CASE WHEN cp.registrado = 0 THEN cp.nombre else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as cliente",
            'join'   => "LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores= p.idcliente 
                       LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
                       LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)"
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
                if($val['field']=='idarribo'){
                    array_push($sqlFilter, "p.idarribo = " . $value . "");
                }
                if($val['field']=='clienteproveedor'){
                    array_push($sqlFilter, "c.denominacionclienteproveedor ILIKE '%" . $value . "%'");
                }
                if ($val['field'] == 'general') {
                    array_push($sqlFilter, "p.nombre ILIKE '%" . $value . "%'");
                } else {
//                    if ($val['field'] == 'nombre') {
//                        array_push($sqlFilter, "p.nombre ilike '%" . $value . "%'");
//                    }
                    if ($val['field'] == 'cliente') {
                        array_push(
                            $sqlFilter, "c.nombre ilike '%" . $value . "%'"
                        );
                    } else {
                        if ($val['field'] == 'tipopenalidad') {
                            array_push(
                                $sqlFilter, "tp.nombre ilike '%" . $value . "%'"
                            );
                        } else {
                            if ($val['field'] == 'contrato') {
                                array_push(
                                    $sqlFilter,
                                    "cont.nombre ilike '%" . $value . "%'"
                                );
                            }
//                            else {
//                                if ($val['field'] == 'plazo') {
//                                    array_push(
//                                        $sqlFilter,
//                                        "p.plazo ilike '%" . $value . "%'"
//                                    );
//                                }
//                                else {
//                                    if ($val['field'] == 'dpp') {
//                                        array_push(
//                                            $sqlFilter,
//                                            "p.dpp ilike '%" . $value . "%'"
//                                        );
//                                    } else {
//                                        if ($val['field'] == 'descuento') {
//                                            array_push($sqlFilter,
//                                                "p.descuento ilike '%" . $value . "%'"
//                                            );
//                                        }
                            else {
                                if ($val['field'] == 'numero') {
                                    array_push(
                                        $sqlFilter,
                                        "cont.numero ilike '%"
                                        . $value . "%'"
                                    );
                                } else {
                                    if ($val['field']
                                        == 'responsable'
                                    ) {
                                        array_push(
                                            $sqlFilter,
                                            "CASE WHEN p.idpersona NOTNULL THEN pers.nombre||' '||pers.papel||' '||pers.sapel else '' END ilike '%"
                                            . $value . "%'"
                                        );
                                    } else {
                                        if ($val['field']
                                            == 'estado'
                                        ) {
                                            array_push(
                                                $sqlFilter,
                                                $this->getFilterList(
                                                    'pe.idestado',
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
                                                ) ? $value
                                                    : array($value);

                                                array_push(
                                                    $sqlFilter,
                                                    'pe.idestado in ('
                                                    . implode(
                                                        ',',
                                                        $idsestado
                                                    ) . ')'
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
                                            }

//                                        }
//                                    }
//                                }
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

    public function insertRecord($arrayData = array())
    {
        try {
            $result = $this->createRecord($arrayData);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }

    }

    protected function createRecord($arrayData = array())
    {
        try {
            $objectModel = new PenalizacionEstado();
            $objectModel->fromArray($arrayData);
            $objectModel->save();
            return $objectModel->idpenalidadestado;
        } catch (Exception $e) {
            throw $e;
        }
    }

}