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
class DatPerfilesClientes extends BaseDatPerfilesClientes
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
    public function cargarperfiles($idestructura, $limit, $start, $filter)
    {
        $where = self::getFilter($filter);
        $query
            = "SELECT
  DISTINCT ON (clpr.idclientesproveedores)
  clpr.idclientesproveedores,
  (CASE WHEN clpr.registrado = 0
    THEN clpr.nombre
   ELSE COALESCE(estru.denominacion, per.nombre || ' ' || per.papel || ' ' || per.sapel) END)   AS nombre,
  (CASE WHEN clpr.registrado = 0
    THEN clpr.codigo
   ELSE COALESCE(estru.codigo, ident.numero) END)                                               AS codigo,
  (CASE WHEN (clpr.registrado = 0 OR (clpr.registrado = 1 AND clpr.idclasificacion = 2))
    THEN clpr.abreviatura
   ELSE estru.abreviatura END)                                                                  AS abreviatura,
  (CASE WHEN clpr.registrado = 0
    THEN clpr.direccion
   ELSE COALESCE(estru.direccion, direc.direccion) END)                                         AS direccion,
  clpr.descripcion,
  (CASE WHEN clpr.registrado = 0
    THEN clpr.correo
   ELSE COALESCE(estru.correo, NULL) END)                                                       AS correo,
  clpr.idtipo,
  (CASE WHEN clpr.registrado = 0
    THEN cast(clpr.telefono AS TEXT)
   ELSE COALESCE(estru.telefono, NULL) END)                                                     AS telefono,
  (CASE WHEN clpr.registrado = 0
    THEN clpr.dpa
   ELSE COALESCE(estru.iddpt, NULL) END)                                                        AS dpa,
  (CASE WHEN clpr.registrado = 0
    THEN encode(clpr.foto, 'escape')
   ELSE COALESCE(ni.icono, 'data:image/jpg;base64,' || '' || encode(dfoto.foto, 'escape')) END) AS foto,
  (CASE WHEN clpr.idclasificacion = 1
    THEN TRUE
   ELSE FALSE END)                                                                              AS entidad,
  (CASE WHEN clpr.idtipo = 1
    THEN 'Cliente'
   ELSE CASE WHEN clpr.idtipo = 2
     THEN 'Proveedor'
        ELSE 'Cliente y Proveedor' END END)                                                     AS tipocliente,
  (CASE WHEN cpe.idestructuracomun = $idestructura
    THEN 1
   ELSE 0 END)                                                                                  AS enuso,
  clpr.idestructura,
  clpr.idpersona,
  clpr.idclasificacion,
  clpr.idclasificacion,
  clpr.registrado,
  clpr.codigocontable,
  clpr.fechainicio,
  clpr.fechafin,
  clpr.idusuario,
  dpt.denominacion                                                                              AS descripciondpa,
  clpr.idusuario,
  su.nombreusuario,
  clpr.idclasificacioncontable,
  cpe.idestructuracomun,
  tmp.idclientesproveedoresmapa                                                                 AS idmapa,
  ARRAY_TO_JSON(ARRAY [dpc.idpregunta, dpc.idrespuesta])                                        AS preguntarespuesta
FROM mod_crmperfil.dat_perfilcliente dpc INNER JOIN mod_datosmaestros.nom_clientesproveedor clpr
    ON clpr.idclientesproveedores = dpc.idclienteproveedor
  LEFT JOIN mod_datosmaestros.dat_clienteproveedorentidad cpe
    ON (clpr.idclientesproveedores = cpe.idclienteproveedor AND cpe.idestructuracomun = $idestructura)
  LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura AND estru.idproyecto = 0)
  LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
  LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
  LEFT JOIN mod_persona.dat_direccion direc ON (clpr.idpersona = direc.idpersona)
  LEFT JOIN mod_persona.dat_foto dfoto ON (clpr.idpersona = dfoto.idpersona AND dfoto.principal = 1)
  LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (dpa = dpt.iddpt)
  LEFT JOIN mod_seguridad.seg_usuario su ON (clpr.idusuario = su.idusuario)
  LEFT JOIN mod_datosmaestros.dat_clientesproveedormapa tmp ON (clpr.idclientesproveedores = tmp.idclientesproveedores)
  LEFT JOIN mod_datosmaestros.nom_clasificacioncontable cc ON clpr.idclasificacioncontable = cc.idclasificacioncontable
  LEFT JOIN mod_estructuracomp.nom_icono ni ON estru.idicono = ni.idicono
  WHERE clpr.idtipo = 1 OR clpr.idtipo = 3
OFFSET $start
LIMIT $limit;";//print_r($query);die;
        $data = self::executeQuery($query);
        foreach ($data as $index => $d) {//print_r($d);die;
            /*$data[$index]['preguntarespuesta'] = self::executeQuery(
                "SELECT dpc.idcuestionario, np.idpregunta, np.pregunta, np.descripcion AS descripcionpregunta, nr.idrespuesta, nr.respuesta,
  nr.descripcion AS descripcionrespuesta, ntr.* FROM mod_crmperfil.dat_perfilcliente dpc INNER JOIN
  mod_crmperfil.nom_pregunta np ON np.idpregunta = dpc.idpregunta INNER JOIN mod_crmperfil.nom_respuesta nr
    ON nr.idrespuesta = dpc.idrespuesta INNER JOIN mod_crmperfil.nom_tiporespuesta ntr
    ON ntr.idtiporespuesta = np.idtiporespuesta WHERE dpc.idclienteproveedor = " . $d['idclientesproveedores'] . ";"
            );*/
            $data[$index]['cuestionario'] = self::executeQuery(
                "SELECT DISTINCT nc.*
FROM mod_crmperfil.dat_perfilcliente dpc INNER JOIN mod_crmperfil.nom_cuestionario nc
ON nc.idcuestionario = dpc.idcuestionario WHERE dpc.idclienteproveedor = " . $d['idclientesproveedores'] . "ORDER BY nc.idcuestionario ASC;"
            );
            foreach ($data[$index]['cuestionario'] as $i => $cuestionario) {
                $data[$index]['cuestionario'][$i]['preguntarespuesta'] = self::executeQuery(
                    "SELECT dpc.idcuestionario, np.idpregunta, np.pregunta, np.descripcion AS descripcionpregunta, nr.idrespuesta, nr.respuesta,
  nr.descripcion AS descripcionrespuesta, ntr.* FROM mod_crmperfil.dat_perfilcliente dpc INNER JOIN
  mod_crmperfil.nom_pregunta np ON np.idpregunta = dpc.idpregunta INNER JOIN mod_crmperfil.nom_respuesta nr
    ON nr.idrespuesta = dpc.idrespuesta INNER JOIN mod_crmperfil.nom_tiporespuesta ntr
    ON ntr.idtiporespuesta = np.idtiporespuesta
    WHERE dpc.idclienteproveedor = " . $d['idclientesproveedores'] . " AND dpc.idcuestionario = ".$cuestionario['idcuestionario']." ORDER BY dpc.idpregunta ASC;"
                );
            }
            $data[$index]['contacto'] = self::executeQuery(
                "SELECT c.*, encode(c.foto,'escape') as foto,dpt.denominacion as descripciondpa,su.nombreusuario FROM mod_datosmaestros.nom_contacto c
                LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (c.dpa = dpt.iddpt)
                LEFT JOIN mod_seguridad.seg_usuario su ON (c.idusuario = su.idusuario)
                WHERE c.idclientesproveedores= " . $d['idclientesproveedores'] . " ORDER BY idcontacto;"
            );
            $data[$index]['cuentabancaria'] = self::executeQuery(
                "SELECT c.*,nb.nombre as nombrebanco,ns.numero as numerosucursal,nm.codigoiso,
                (CASE WHEN c.predeterminado = 1 THEN TRUE else FALSE END) as predeterminado
                FROM mod_datosmaestros.dat_cuentabanccliente c
                LEFT JOIN mod_datosmaestros.nom_banco nb ON (c.idbanco = nb.idbanco)
                LEFT JOIN mod_datosmaestros.nom_sucursal ns ON (c.idsucursal = ns.idsucursal)
                LEFT JOIN mod_datosmaestros.nom_moneda nm ON (c.idmoneda = nm.idmoneda)
                WHERE c.idclienteproveedores= " . $d['idclientesproveedores'] . " ORDER BY c.predeterminado DESC ;"
            );
            $data[$index]['cobrospagos'] = self::executeQuery(
                "SELECT cpcp.idclienteproveedorcobropago,cpcp.idcuenta,ncu.concatcta||' '||ncu.descripcion as nombrecuenta,
                cpcp.clasificacion as idclasificacion,
                (CASE WHEN cpcp.clasificacion = 1 THEN 'Cuenta a pagar' else 'Cuenta a cobrar' END) as nombclasificacion,
                cpcp.idmoneda,nm.codigoiso,cpcp.idclienteproveedor
                FROM mod_datosmaestros.dat_clienteproveedorcobropago cpcp
                LEFT JOIN mod_contabilidad.nom_cuenta ncu ON (cpcp.idcuenta = ncu.idcuenta)
                LEFT JOIN mod_datosmaestros.nom_moneda nm ON (cpcp.idmoneda = nm.idmoneda)
                WHERE cpcp.idclienteproveedor=" . $d['idclientesproveedores'] . " ;"
            );
        }//print_r($data);die;
        $queryCount
            = "SELECT
                count(DISTINCT clpr.idclientesproveedores)
FROM mod_crmperfil.dat_perfilcliente dpc INNER JOIN mod_datosmaestros.nom_clientesproveedor clpr
    ON clpr.idclientesproveedores = dpc.idclienteproveedor
  LEFT JOIN mod_datosmaestros.dat_clienteproveedorentidad cpe
    ON (clpr.idclientesproveedores = cpe.idclienteproveedor AND cpe.idestructuracomun = $idestructura)
  WHERE clpr.idtipo = 1 OR clpr.idtipo = 3;";//print_r($query);die;
        return array('cantidad' => self::executeQuery($queryCount)[0]['count'], 'datos' => $data);
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

    public function cargarpreguntas($idcuestionario)
    {
        $query
            = "SELECT
                      dcp.idcuestionario,
                      np.idpregunta,
                      np.pregunta,
                      np.descripcion,
                      np.idtiporespuesta
                    FROM mod_crmperfil.dat_cuestionariopregunta dcp INNER JOIN mod_crmperfil.nom_pregunta np
                        ON np.idpregunta = dcp.idpregunta
                    WHERE dcp.idcuestionario = $idcuestionario";
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
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();

        return $conexionActual->fetchAll($query);
    }

}
