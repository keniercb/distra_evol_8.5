<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Domain
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class DatSegmentacion extends BaseSegmentacion
{

    public function setUp()
    {
        parent::setUp();
    }


    /**
     * @param $idestructura
     *
     * @return array
     */
    public function cargarsegmentacion(/*$idestructura,*/
        $limit, $start, $filter
    ) {
        $where = self::getFilter($filter);
        $query
            = "Select * from mod_crmperfil.dat_segementacion
OFFSET $start
LIMIT $limit;";//print_r($query);die;
        $data = self::executeQuery($query);
        $queryCount
            = "Select count(idsegmentacion) from mod_crmperfil.dat_segementacion;";//print_r($query);die;
        return array('cantidad' => self::executeQuery($queryCount)[0]['count'], 'datos' => $data);
    }

    public function dataType($idTipoRespuesta, $type)
    {
        $query
            = "SELECT cast(np.respuesta AS ". ($type == 'numeric' ? "NUMERIC": "DATE") .")
                    FROM mod_crmperfil.nom_respuesta np
                    WHERE np.idtiporespuesta = $idTipoRespuesta;";
        return self::executeQuery($query);
    }

    private function getFilter($filtro)
    {
        $filter = $filtro[0];
        if ($filter) {
            $where = array();
            foreach ($filter as $f) {
                $value = $f['data']['value'];
                if ($value) {
                    $type = $f['data']['type'];
                    if ($type == 'string') {
                        if ($f['field'] == 'tipocontrato') {
                            $where[] = "denominaciontipocontrato ILIKE '%" . $value . "%'";
                        }
                        if ($f['field'] == 'clienteproveedor') {
                            $where[] = "denominacionclienteproveedor ILIKE '%" . $value . "%'";
                        }
                        if ($f['field'] != 'clienteproveedor' && $f['field'] != 'tipocontrato') {
                            $where[] = $f['field'] . " ILIKE '%" . $value . "%'";
                        }
                    }
                    if ($type == 'boolean') {
                        $where[] = $f['field'] . " = " . ($value == 'true' ? 1 : 0);
                    }
                    if ($type == 'numeric') {
                        if ($f['data']['comparison'] == 'lt') {
                            $where[] = $f['field'] . " < " . $value;
                        }
                        if ($f['data']['comparison'] == 'gt') {
                            $where[] = $f['field'] . " > " . $value;
                        }
                        if ($f['data']['comparison'] == 'eq') {
                            $where[] = $f['field'] . " = " . $value;
                        }
                    }
                    if ($type == 'date') {
                        list($moth, $day, $year) = explode(
                            '/', $value
                        );
                        $value = "$day/$moth/$year";
                        if ($f['data']['comparison'] == 'lt') {
                            $where[] = $f['field'] . " < '" . $value . "'";
                        }
                        if ($f['data']['comparison'] == 'gt') {
                            $where[] = $f['field'] . " > '" . $value . "'";
                        }
                        if ($f['data']['comparison'] == 'eq') {
                            $where[] = $f['field'] . " = '" . $value . "'";
                        }
                    }
                }
            }
            if (!empty($where)) {
                $tmp = implode($filtro[1], $where);
                return "AND ( " . $tmp . " )";
            }
        }
        return '';
    }

    public function cargarClienteProveedor($idestructura)
    {
        $query
            = "SELECT
                  clpr.idclientesproveedores,
                  (CASE WHEN clpr.registrado = 0
                    THEN clpr.nombre
                   ELSE COALESCE(estru.denominacion, per.nombre || ' ' || per.papel || ' ' || per.sapel) END) AS nombre,
                  ARRAY_TO_JSON(ARRAY [clpr.idtipo, clpr.idclasificacion]) AS tipo
                FROM mod_datosmaestros.nom_clientesproveedor clpr
                  LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura AND estru.idproyecto = 0)
                  LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
                  LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
                  LEFT JOIN mod_persona.dat_direccion direc ON (clpr.idpersona = direc.idpersona)
                  LEFT JOIN mod_persona.dat_foto dfoto ON (clpr.idpersona = dfoto.idpersona)
                  LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (dpa = dpt.iddpt)
                  LEFT JOIN mod_seguridad.seg_usuario su ON (clpr.idusuario = su.idusuario)
                  LEFT JOIN mod_datosmaestros.dat_clientesproveedormapa tmp ON (clpr.idclientesproveedores = tmp.idclientesproveedores)
                  LEFT JOIN mod_datosmaestros.nom_clasificacioncontable cc ON clpr.idclasificacioncontable = cc.idclasificacioncontable
                  LEFT JOIN mod_estructuracomp.nom_icono ni ON estru.idicono = ni.idicono
                WHERE clpr.idestructuracomun = $idestructura
                ORDER BY clpr.idclientesproveedores ASC;";
        return self::executeQuery($query);
    }

    /**
     * @param $query
     *
     * @return array
     * @throws Doctrine_Connection_Exception
     */
    private function executeQuery($query)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $objDoctrine->reset();
            $conexionActual = $objDoctrine->getCurrentConnection();

            return $conexionActual->fetchAll($query);
        } catch (Exception $e) {
            return false;
        }
    }

}
