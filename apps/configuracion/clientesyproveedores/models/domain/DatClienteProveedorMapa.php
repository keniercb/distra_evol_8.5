<?php

/**
 * Clase modelo para datos de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Domain
 * @copyright  XETID.
 * @version    1.0-0
 */
class DatClienteProveedorMapa extends BaseDatClienteProveedorMapa
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomClienteproveedor', array('local'   => 'idclienteproveedores',
                                         'foreign' => 'idclienteproveedores')
        );
        parent::setUp();
    }

    public function getByCondition($conditions)
    {
        $where = $this->getFilter($conditions);
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query = "SELECT tmp.*,
                  (CASE WHEN ncp.registrado = 0 THEN ncp.nombre else COALESCE (des.denominacion, dp.nombre||' '||dp.papel||' '||dp.sapel) END) as nombre,
                  (CASE WHEN ncp.idtipo = 1 THEN 'Cliente' else CASE WHEN ncp.idtipo = 2 THEN 'Proveedor' ELSE 'Cliente y Proveedor' END END) as tipo
                   FROM mod_datosmaestros.dat_clientesproveedormapa tmp
                   INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp on (tmp.idclientesproveedores=ncp.idclientesproveedores)
                   LEFT JOIN mod_estructuracomp.dat_estructura des ON (ncp.idestructura = des.idestructura and des.idproyecto=0)
                   LEFT JOIN mod_persona.dat_persona dp ON (ncp.idpersona = dp.idpersona)
                   $where";
        $result = $conexionActual->fetchAll($query);
        return $result;
    }

    public function getFilter($conditions)
    {
        foreach ($conditions as $key => $condition) {
            $where[] = "tmp.$key=$condition";
        }
        return count($where) != 0 ? ' where ' . implode(' AND ', $where) : '';
    }

    static function addPtoMapa($idcliente, $idestructura, $array)
    {
        try {
            $instance = Doctrine_Manager::getInstance();
            $conexion = $instance->getCurrentConnection();

            if ($array['idmapa']) {
                $query = "UPDATE mod_datosmaestros.dat_clientesproveedormapa SET idclientesproveedores=$idcliente,idestructuracomun=$idestructura,imagen='"
                    . $array['icono'] . "',latitud=" . $array['y']
                    . ",longitud=" . $array['x']
                    . ",minscale=0,maxscale=80000000,wkb_geometry = public.setsrid(public.GeometryFromText('POINT ("
                    . $array['x'] . " " . $array['y']
                    . ")'),4326) WHERE idclientesproveedoresmapa="
                    . $array['idmapa'];
            } else {
                $query = "INSERT INTO mod_datosmaestros.dat_clientesproveedormapa VALUES (DEFAULT,$idcliente,0,80000000,"
                    . $array['y'] . "," . $array['x'] . ",'" . $array['icono']
                    . "',public.setsrid(public.GeometryFromText('POINT ("
                    . $array['x'] . " " . $array['y']
                    . ")'),4326),$idestructura)";
            }
            $conexion->fetchAll($query);

            if ($array['idmapa']) {
                return $array['idmapa'];
            } else {
                return $conexion->lastInsertId(
                    'mod_datosmaestros.sec_clientesproveedormapatmp'
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
}
