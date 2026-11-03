<?php

/**
 * ClientesProveedoresRepository
 *
 * @package    Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright  UCID
 * @version    1.0
 */
class ClientesProveedoresRepository
{
    public function getClientesProveedores($iddominio, $params)
    {
        $sentenceSelect = [$this->getSqlSelect(),
                           $this->getSqlCountContrato($iddominio)];
        $sentenceWhere = [$this->getSqlFilterContrato($iddominio, $params['filters'])];

        if (count($params['filters'])) {
            $filters=$this->getSqlFilters($params['filters'], $iddominio);
            if($filters!=''){
                array_push($sentenceWhere,$filters);
            }

        }

        $query = "SELECT count(clpr.idclientesproveedores) over()," . implode(
                ',', $sentenceSelect
            ) . ' ' . $this->getSqlFrom() .
            " WHERE " . implode(' and ', $sentenceWhere);

        if ($params['limit']) {
            $params['start'] = !is_null($params['start']) ? $params['start']
                : 0;
            $query .= " LIMIT " . $params['limit'] . " OFFSET "
                . $params['start'];
        }
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $data = $conn->fetchAll($query);
        $cant = count($data) ? $data[0]['count'] : 0;
        return array(
            'data' => $data,
            'cant' => $cant
        );
    }

    private function getSqlSelect()
    {
        return "clpr.idclientesproveedores, clpr.codigocontable, clpr.descripcion, clpr.idtipo, clpr.idclasificacion, clpr.idclasificacioncontable,
            (CASE WHEN clpr.registrado = 0 THEN clpr.nombre else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as nombre,
            (CASE WHEN clpr.registrado = 0 THEN clpr.codigo else COALESCE (estru.codigo, ident.numero) END) as codigo,
            (CASE WHEN (clpr.registrado = 0 OR (clpr.registrado=1 AND clpr.idclasificacion=2)) THEN clpr.abreviatura else estru.abreviatura END) as abreviatura,
            (CASE WHEN clpr.registrado = 0 THEN clpr.direccion else COALESCE (estru.direccion, direc.direccion) END) as direccion,
            (CASE WHEN clpr.registrado = 0 THEN clpr.correo else COALESCE (estru.correo, null) END) as correo,
            (CASE WHEN clpr.registrado = 0 THEN cast(clpr.telefono as text) else COALESCE (estru.telefono, null) END) as telefono,
            (CASE WHEN clpr.registrado = 0 THEN encode(clpr.foto,'escape') else COALESCE (ni.icono,'data:image/jpg;base64,'||''||encode(dfoto.foto,'escape')) END) as foto";
    }

    private function getSqlFrom()
    {
        return "from mod_datosmaestros.nom_clientesproveedor clpr
                LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura and estru.idproyecto=0)
                LEFT JOIN mod_estructuracomp.nom_icono ni on estru.idicono = ni.idicono
                LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
                LEFT JOIN mod_persona.dat_direccion direc ON (clpr.idpersona = direc.idpersona)
                LEFT JOIN mod_persona.dat_foto dfoto ON (clpr.idpersona = dfoto.idpersona and dfoto.principal = 1)
                LEFT JOIN mod_datosmaestros.nom_clasificacioncontable cc on clpr.idclasificacioncontable = cc.idclasificacioncontable";
    }

    private function getSqlCountContrato($iddominio)
    {
        return "( select count(c.idclienteproveedor)
                from mod_crmcontratacion.dat_contrato c
                LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
                where nfe.dominiofila[" . $iddominio . "]= 1::bit and clpr.idclientesproveedores = c.idclienteproveedor and ((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre)
                    FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) OR
                    (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre)
                    FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0))
            ) as cantContratos";
    }

    private function getSqlFilterContrato($iddominio, $filters)
    {
        return 'clpr.idclientesproveedores IN 
            ( select distinct(c.idclienteproveedor) '
            . $this->getSqlContratoDominio($iddominio, $filters) . ')';
    }

    private function getSqlContratoDominio($iddominio, $filters)
    {
        $filtro = '';
        if(count($filters)){
            foreach ($filters as $f){
                if($f['property']=='idsector'){
                    $filtro=' and c.idsector = '.$f['value'].' ';
                }
            }

        }
        return 'from mod_crmcontratacion.dat_contrato c
            LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
            INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
            where dominiofila[' . $iddominio . ']= 1::bit '.$filtro;
    }

    private function getSqlFilters($filters, $iddominio)
    {
        $sqlFilter = array();

        foreach ($filters as $val) {

            if ($val['property'] == 'idtipo') {
                array_push(
                    $sqlFilter,
                    '(clpr.idtipo = 3 OR clpr.idtipo = ' . $val['value'] . ')'
                );
            }

            if ($val['property'] == 'nombre') {
                $sqlNombre
                    = "(CASE WHEN clpr.registrado = 0 THEN clpr.nombre else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END)";
                array_push(
                    $sqlFilter, $sqlNombre . " ilike '%" . $val['value'] . "%'"
                );
            }

            if ($val['property'] == 'abreviatura') {
                $sqlAbrev
                    = "(CASE WHEN (clpr.registrado = 0 OR (clpr.registrado=1 AND clpr.idclasificacion=2)) THEN clpr.abreviatura else estru.abreviatura END)";
                array_push(
                    $sqlFilter, $sqlAbrev . " ilike '%" . $val['value'] . "%'"
                );
            }

            if ($val['property'] == 'codigo') {
                $sqlCodigo
                    = '(CASE WHEN clpr.registrado = 0 THEN clpr.codigo else COALESCE (estru.codigo, ident.numero) END)';
                array_push(
                    $sqlFilter, $sqlCodigo . " ilike '%" . $val['value'] . "%'"
                );
            }

            if ($val['property'] == 'fechafirma') {
                $val = Zend_Json::decode($val['value']);
                $sql = $this->getSqlContratoDominio($iddominio) . ' and ';

                switch ($val['tipooperacion']) {
                    case 1:
                        $sql = $sql . "c.fechafirma = '" . $val['fechainicio']
                            . "'";
                        break;
                    case 2:
                        $sql = $sql . "c.fechafirma <> '" . $val['fechainicio']
                            . "'";
                        break;
                    case 3:
                        $sql = $sql . "c.fechafirma > '" . $val['fechainicio']
                            . "'";
                        break;
                    case 4:
                        $sql = $sql . "c.fechafirma < '" . $val['fechainicio']
                            . "'";
                        break;
                    case 5:
                        $sql = $sql . "c.fechafirma BETWEEN '"
                            . $val['fechainicio'] . "' and '" . $val['fechafin']
                            . "'";
                        break;
                }
                $sqlFechaFirma
                    = 'clpr.idclientesproveedores IN ( select distinct(c.idclienteproveedor) '
                    . $sql . ')';

                array_push($sqlFilter, $sqlFechaFirma);
            }

        }
        return implode(" and ", $sqlFilter);
    }

    public function getContactosByIdClienteP($idcliente)
    {
        $query
            = "SELECT c.*, encode(c.foto,'escape') as foto,dpt.denominacion as descripciondpa,su.nombreusuario FROM mod_datosmaestros.nom_contacto c
                LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (c.dpa = dpt.iddpt)
                LEFT JOIN mod_seguridad.seg_usuario su ON (c.idusuario = su.idusuario)
                WHERE c.idclientesproveedores=" . $idcliente
            . " ORDER BY idcontacto;";

        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll($query);
    }

    public function getCuentasByIdClienteP($idcliente)
    {
        $query
            = "SELECT c.*,nb.nombre as nombrebanco,ns.numero as numerosucursal,nm.codigoiso,
                (CASE WHEN c.predeterminado = 1 THEN TRUE else FALSE END) as predeterminado
                FROM mod_datosmaestros.dat_cuentabanccliente c
                LEFT JOIN mod_datosmaestros.nom_banco nb ON (c.idbanco = nb.idbanco)
                LEFT JOIN mod_datosmaestros.nom_sucursal ns ON (c.idsucursal = ns.idsucursal)
                LEFT JOIN mod_datosmaestros.nom_moneda nm ON (c.idmoneda = nm.idmoneda)
                WHERE c.idclienteproveedores=" . $idcliente
            . " ORDER BY c.predeterminado DESC ;";

        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll($query);
    }

    public function getContratosByIdClienteP($idcliente, $iddominio)
    {
        $query
            = "SELECT c.idcontrato,c.numero,c.numerocontrato,c.idclienteproveedor,c.idtipocontrato,c.nombre,c.fechafirma,c.fechainicio,c.idpadre,
                  c.idestructuracomun,c.elemento,c.registropago,c.montototal,c.fechafin,c.denominaciontipocontrato AS tipocontrato,
                  c.denominacionclienteproveedor AS clienteproveedor,c.proforma,c.idproforma,dpr.idplantilla,c.objeto,c.descripcion,c.contratomarco,
                  c.cliente,c.idcontratomarco,c.idestado,ne.nombre as estadoinicial,ne.icono as iconoestadoinicial,ne.acciones,
                  c.idmediopago,c.version,c.idsector,ns.idsector,ns.denominacion as sector,nmp.nombre AS mediopago,c.numerojson
                  ,c.vigencia,c.unidadtiempo,c.idresponsable as idpersona,c.idcondicionpago,ntp.nombre as condicionpago,
                  (CASE WHEN c.idresponsable NOTNULL THEN per.nombre||' '||per.papel||' '||per.sapel else '' END) as nombrepersona,
                  (CASE WHEN c.fechainicio <='" . date('d/m/Y')
            . "' AND (c.fechafin>='" . date('d/m/Y') .
            "' OR c.fechafin ISNULL) THEN 1 ELSE 0 END) as vigente,fechaestado,fechamodificacion,
                  (SELECT c2.numerocontrato FROM mod_crmcontratacion.dat_contrato c2 WHERE c.idcontratomarco = c2.idcontrato)
                  AS denominacioncontratomarco,c.idarea,COALESCE (desop.denominacion, des.denominacion) as nombrearea
                FROM mod_crmcontratacion.dat_contrato c
                INNER JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = c.idestado
                LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago = c.idmediopago
                LEFT JOIN mod_crmcontratacion.nom_sector ns ON ns.idsector = c.idsector
                LEFT JOIN mod_persona.dat_persona per ON (c.idresponsable = per.idpersona)
                LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON c.idcondicionpago = ntp.idterminodepago
                LEFT JOIN mod_crmcontratacion.dat_proforma dpr ON c.idproforma = dpr.idproforma
                LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)  
                where nfe.dominiofila[" . $iddominio
            . "]= 1::bit and  c.idclienteproveedor = " . $idcliente . " and ((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre)
                FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) OR
                (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre)
                FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0))";

        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll($query);
    }
}