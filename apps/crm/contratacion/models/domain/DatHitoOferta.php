<?php

/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:44 PM
 */
class DatHitoOferta extends BaseDatHitoOferta
{

    public function setUp()
    {
        parent::setUp();
    }

    static function cargarhitosofertas($post)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $where = '';
            if($post['idoferta']){
                $where = "WHERE h.idoferta = " . $post['idoferta'];
            }
//            if ($post->property == 'idoferta' && $post->value) {
//                if (is_array($post->value)) {
//                    $where = "WHERE h.idoferta in (" . implode(',', $post->value) . ")";
//                } else {
//                    $where = "WHERE h.idoferta = " . $post->value;
//                }
//            }
            $query
                = "SELECT h.idhitooferta AS idhito, h.descripcion, h.vigencia, h.unidadtiempo,
                h.numero, h.fechacreacion, h.fechaestimada as fechafin, h.idarea,
                COALESCE (desop.denominacion, des.denominacion) as nombrearea
                FROM mod_crmcontratacion.dat_hitooferta h
                LEFT JOIN mod_estructuracomp.dat_estructura des 
                ON (h.idarea = des.idestructura and des.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop 
                ON (h.idarea = desop.idestructuraop and desop.idproyecto = 0)
                " . $where."  ORDER BY h.numero";
            $datoshito = $conexionActual->fetchAll($query);
//            ,
//            e.nombre AS estado, e.icono
//            LEFT JOIN mod_crmcontratacion.dat_hitoestado he
//                ON (h.idhitooferta=he.idhitooferta AND he.fechafin IS NULL)
//            LEFT JOIN mod_crmcontratacion.nom_estado e
//                ON e.idestado=he.idestado

            foreach ($datoshito as $index => $hito) {
                $pago = DatMonedaHitoOferta::cargarMonedasHito(
                    array(
                        'idhito' => $hito['idhito'], 'idestructura' => $post['idestructura'])
                );
                $total = 0;
                foreach ($pago as $p) {
                    $total = $total + (float)$p['monto'];
                }
                $datoshito[$index]['pago'] = $pago;
                $datoshito[$index]['monto'] = $total;
//            }
//            foreach ($datoshito as $index => $hito) {
                $indicadores = DatIndicadorHitoOferta::cargarIndicadoresHito(array('idhito' => $hito['idhito']));
                foreach ($indicadores as $indexindi => $indi) {
                    $moneda = DatMonedaIndicadorHitoOferta::cargarMonedasIndicador(
                        array('idindicador'  => $indi['idindicadorcontrato'],
                              'idestructura' => $post['idestructura'])
                    );
                    if (count($moneda)) {
                        foreach ($moneda as $mon) {
                            if ($mon['moneda'] == 'CUP' && $indi['precio'] == '') {
                                $indicadores[$indexindi]['precio'] = $mon['monto'];
                            }
                            if ($mon['moneda'] == 'CUC' && $indi['preciodivisa'] == '') {
                                $indicadores[$indexindi]['preciodivisa'] = $mon['monto'];
                            }
                        }
                    }
                }
                $datoshito[$index]['indicadores'] = $indicadores;
            }
            return $datoshito;
        } catch (Doctrine_Exception $e) {
//            throw $e;
            throw $e;
        }
    }

    static function eliminarHitos($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatHitoOferta')
            ->whereIn('idhitooferta', $array)
            ->execute();
    }

    public function guardarHitoOferta($valor, $idcontrato)
    {
        try {
            $hito = $valor->idhito ? Doctrine::getTable('DatHitoOferta')->find($valor->idhito)
                : new DatHitoOferta();
            if (!$valor->idhito) {
                $hito->fechacreacion = date('Y-m-d');
            }
            $hito->descripcion = $valor->descripcion;
            $hito->vigencia = $valor->vigencia;
            $hito->unidadtiempo = $valor->unidadtiempo;
            $hito->numero = $valor->numero;
            // $hito->fechacreacion = $valor->fechacreacion;
            $hito->fechaestimada = $valor->fechafin ? $valor->fechafin : null;
            $hito->idoferta = $idcontrato;
            $hito->idarea = $valor->idarea;
            $hito->save();
            $idhito = $hito->idhitooferta;
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
//            throw $e;
        }

        foreach ($valor->pago as $moneda) {
            DatMonedaHitoOferta::guardarMonedaHito($moneda, $idhito);
        }
        if ($valor->arrayIndicadores) {
            if (count($valor->arrayIndicadores->modificados)) {
                foreach ($valor->arrayIndicadores->modificados as $indicador) {
                    DatIndicadorHitoOferta::guardarIndicadorHito($indicador, $hito);
                }
            }
            if (count($valor->arrayIndicadores->eliminados)) {
                DatIndicadorHitoOferta::eliminarIndicadoresHitos($valor->arrayIndicadores->eliminados);
            }
        }
        return $idhito;

    }

    public function getHitosDominio($params, $columnas, $group, $sum)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            $query = $this->getMainQuery($columnas, $sum);
            $filters = $this->getFilters($params['filter']);
            if (count($filters)) {
                $where = " WHERE " . implode(" AND ", $filters);
                $query .= $where;
            }
            $query .= $this->getGroupQuery($group);
            $query .= $this->getSortQuery($params['sort']);
            if (!is_null($params['start']) && !is_null($params['limit'])) {
                $query .= " offset " . $params['start'] . " limit " . $params['limit'];
            }
            $result = $conexion->fetchAll($query);

            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getMainQuery($columns, $sum)
    {
        return "SELECT dh.*,COALESCE (dh.fechareplanificada, dh.fechaestimada) as fechafin,dmh.*,(" . implode('+', $sum) . ") as montototal,
                count(dh.idhito) over(),dc.numerocontrato,dc.idcontrato,dc.idcondicionpago,ncp.idclientesproveedores,
                (CASE WHEN ncp.registrado = 0 THEN ncp.nombre else COALESCE (dest.denominacion, dper.nombre||' '||dper.papel||' '||dper.sapel) END) as nombre,
                (CASE WHEN ncp.registrado = 0 THEN ncp.codigo else COALESCE (dest.codigo, did.numero) END) as codigo,
                COALESCE (desop.denominacion, des1.denominacion) as nombrearea,
                dhe.idestado
                FROM mod_crmcontratacion.dat_hito dh
                LEFT JOIN mod_crmcontratacion.dat_indicadorhito dih ON dh.idhito = dih.idhito
                INNER JOIN crosstab('SELECT dmh.idhito,dmh.idmoneda,dmh.valor FROM mod_crmcontratacion.dat_monedahito dmh ORDER BY 1,2',
                'SELECT DISTINCT nm.idmoneda FROM mod_datosmaestros.dat_monedaentidad dme INNER JOIN mod_datosmaestros.nom_moneda nm ON
                nm.idmoneda = dme.idmoneda INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
                INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idestructuracomun = dme.idestructuracomun
                WHERE nfe.dominiofila[1] = 1::bit ORDER BY nm.idmoneda') AS dmh (" . implode(",", $columns) . ") on dh.idhito = dmh.idhito
                INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dh.idcontrato
                LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito = dhe.idhito and dhe.fechafin ISNULL)
                INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp ON ncp.idclientesproveedores = dc.idclienteproveedor
                LEFT JOIN mod_estructuracomp.dat_estructura dest ON (ncp.idestructura = dest.idestructura and dest.idproyecto=0)
                LEFT JOIN mod_estructuracomp.dat_estructura des1 ON (dh.idarea = des1.idestructura and des1.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (dh.idarea = desop.idestructuraop and desop.idproyecto = 0)
                LEFT JOIN mod_persona.dat_persona dper ON (ncp.idpersona = dper.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad did ON (dper.idpersona = did.idpersona)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (dc.idarea = nfe.idfila)";
    }

    private function getSortQuery($sort)
    {
        if ($sort) {
            $sort = json_decode($sort);
            $query = " ORDER BY";
            $result = [];
            foreach ($sort as $field) {
                $result[] = " $field->property $field->direction";
            }
            return $query . implode(',', $result);
        }
        return " ORDER BY fechafin ASC";
    }

    private function getGroupQuery($group)
    {
        return " GROUP BY dh.idhito,dc.numerocontrato,dc.idcontrato,ncp.idclientesproveedores,dest.idestructura,
            dest.denominacion,dper.nombre,dper.papel,dper.sapel,dest.codigo,did.numero,dhe.idestado,desop.denominacion,
            des1.denominacion," . implode(",", $group);
    }

    public function getFilters($params)
    {
        $isstring = array('string', 'character varying', 'varchar');
        $isnumeric = array('int', 'numeric');
        $filter = array();
        foreach ($params as $param) {
            $field = $param['field'];
            $type = $param['data']['type'];
            $value = $param['data']['value'];
            $comparison = $param['data']['comparison'];

            if (in_array($type, $isnumeric)) {
                $result = $this->getNumericFilter($field, $value, $comparison);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if (in_array($type, $isstring)) {
                $result = $this->getStringFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if ($type == 'bit') {
                $result = $this->getBitFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if ($type == 'date') {
                $result = $this->getDateFilter($field, $value, $comparison);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if ($type == 'boolean') {
                $result = $this->getBooleanFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if ($type == 'list') {
                $result = $this->getListFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }
        }
        return $filter;
    }

    private function getNumericFilter($field, $value, $comparison)
    {
        if ($value || $value == 0) {
            if ($comparison) {
                if ($comparison == 'lt') {
                    return $field . " < " . $value;
                }
                if ($comparison == 'gt') {
                    return $field . " > " . $value;
                }
                if ($comparison == 'eq') {
                    return $field . " = " . $value;
                }
                if ($comparison == 'null') {
                    return $field . $value;
                }
            } else {
                if (is_array($value)) {
                    return $field . " IN (" . implode(',', $value) . ")";
                } else {
                    return $field . " = " . $value;
                }
            }
        }
    }

    private function getStringFilter($field, $value)
    {
        if ($value) {
            return "$field ILIKE '%" . $value . "%'";
        }
    }

    private function getBitFilter($field, $value)
    {
        if ($value) {
            return $field . "[" . $value . "] = 1::bit";
        }
    }

    private function getDateFilter($field, $value, $comparison)
    {
        if ($value) {
            list($moth, $day, $year) = explode(
                '/', $value
            );
            $value = "$day/$moth/$year";
            if ($comparison == 'lt') {
                return $field . " < '" . $value . "'";
            }
            if ($comparison == 'gt') {
                return $field . " > '" . $value . "'";
            }
            if ($comparison == 'eq') {
                return $field . " = '" . $value . "'";
            }
        }
    }

    public function getBooleanFilter($field, $value)
    {
        if ($value) {
            if ($field == 'vigente') {
                return $value ?
                    "dc.fechafirma <='" . date('d/m/Y') . "' AND (dc.fechafin>='" . date('d/m/Y')
                    . "' OR dc.fechafin ISNULL)"
                    : "dc.fechafirma >'" . date('d/m/Y') . "' OR dc.fechafin<'" . date('d/m/Y') . "' ";
            }
            return $field . " = " . $value;
        }
    }

    public function getListFilter($field, $value)
    {
        $fields = array('idestado'=>'dhe.idestado');
        if ($value) {
            if (!is_array($value)) {
                $value = json_decode($value);
                $value = !is_array($value) ? [$value] : $value;
            }
            $field = $fields[$field] ? $fields[$field] : $field;
            return $field . " IN (" . implode(',', $value) . ")";
        }
    }

    public function refactorResponse($result)
    {
        foreach ($result as $key => $row) {
            $result[$key]['indicadores'] = json_decode($row['indicadores']);
        }
        return $result;
    }

    public function obtenerMonedaDominio($iddominio)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            if (!$iddominio) {
                return array();
            }
            $query = "SELECT DISTINCT nm.idmoneda,nm.codigoiso FROM mod_datosmaestros.dat_monedaentidad dme
                      INNER JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda = dme.idmoneda
                      INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
                      INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idestructuracomun = dme.idestructuracomun
                      WHERE nfe.dominiofila[$iddominio] = 1::bit ORDER BY nm.idmoneda;";
            $result = $conexion->fetchAll($query);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

}