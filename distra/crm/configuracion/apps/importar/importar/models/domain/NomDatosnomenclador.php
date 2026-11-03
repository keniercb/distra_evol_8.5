<?php

/**
 * NomDatosnomenclador
 *
 *
 * @ author Drisis Silvia D�az Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class NomDatosnomenclador extends BaseNomDatosnomenclador {

    public function setUp() {
        parent::setUp();

        $this->hasOne(
                'NomTiponomenclador', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
        $this->hasMany(
                'NomIndicador', array('local' => 'iddatosnomenclador', 'foreign' => 'naturaleza')
        );
        $this->hasMany(
                'DatEntidaddatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatDatosnomencladoractividad', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatDatosnomencladordatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomencladorpadre')
        );
        $this->hasMany(
                'DatDatosnomencladordatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomencladorhijo')
        );
        $this->hasMany(
                'DatModelodatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'TempInsindicador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'TempInsactividad', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'TempInsnorma', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );

        $this->hasMany(
                'TempInsindicadorviayos', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'TempIndicadorprecio', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );

        $this->hasMany(
                'DatDocumentoaprobacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idoperacion')
        );
        $this->hasMany(
                'DatDocumentoaprobacion', array('local' => 'iddatosnomenclador',
            'foreign' => 'idtipoaprobacion')
        );
        $this->hasMany(
                'NomEjercicioplanificacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idestado')
        );
        $this->hasMany(
                'DatProcesofuncionalidadestado', array('local' => 'iddatosnomenclador', 'foreign' => 'idestado')
        );
        $this->hasMany(
                'DatDesglosedatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
    }

    public function ObtenerDatosNomenclador($idtiponomenclador, $dataindex, $ordenar = false) {
        $alias = ' nom_datosnomenclador_denominacion';
        if ($dataindex) {
            $alias = $dataindex;
        }
        $query = new Doctrine_Query();
        if ($ordenar) {
            $query->orderBy('m.denominacion');
        } else {
            $query->orderBy('m.iddatosnomenclador');
        }
        $temp = $query->select(
                        'm.iddatosnomenclador, m.denominacion as ' . $alias
                )->from('NomDatosnomenclador m')
                ->where('m.idtiponomenclador=?', $idtiponomenclador)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $temp;
    }

    //Utilizado como servicio
    public function ObtenerDatosprimeto($idtiponomenclador) {
        $guion = '-';
        $query = new Doctrine_Query();
        $temp = $query->select(
                                'm.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion'
                        )->from('NomDatosnomenclador m')
                        ->where(
                                'm.idtiponomenclador=? AND m.denominacion=?', array($idtiponomenclador, $guion)
                        )->execute()->getFirst();
        return $temp;
    }

    public function getDatosNomPorIdTipoNom($idtiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select(
                                'm.iddatosnomenclador, m.denominacion as denominacionnom, m.descripcion'
                        )->from('NomDatosnomenclador m')
                        ->where('m.idtiponomenclador=?', $idtiponomenclador)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function ObtenerDatosDadoIdDatosNom($iddatosnomenclador) {
        $query = new Doctrine_Query();
        return $query->select('m.denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.iddatosnomenclador=?', $iddatosnomenclador)
                        ->execute()->toArray();
    }

    public function listarOqsatisface($idtiponomenclador) {
        $query = new Doctrine_Query();
        $temp = $query->from('NomDatosnomenclador d')
                        ->where('d.idtiponomenclador=?', $idtiponomenclador)
                        ->execute()->toArray();
        return $temp;
    }

    public function obtenerTipoNomenclador($parametros) {
        $query = new Doctrine_Query();
        $where = '';
        $flag = false;

        if ($parametros['nodo'] == 'undefined') {
            $where = 'n.cantascendente = 0';
        } else {
            $where = "dn.iddatosnomencladorpadre =  " . $parametros['nodo'];
            $flag = true;
        }
        $query->select('*,')
                ->from('NomDatosnomenclador n')
                ->innerJoin(' n.NomTiponomenclador ntn');

        if ($flag) {
            $query->innerJoin("n.DatDatosnomencladordatosnomenclador dn");
        }

        $query->where($where)
                ->addWhere('ntn.uritiponomenclador=?', $parametros['uri'])
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function getDatosNomPorUriTipoNomIdestado($uritiponomenclador) {
        $query = new Doctrine_Query();
        if ($uritiponomenclador->idestado) {
            $query->addWhere("dn.iddatosnomenclador <> " . $uritiponomenclador->idestado . "");
        }
        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', $uritiponomenclador->uri)->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNomIdestadoDadoEstado($uritiponomenclador
    ) {
        $query = new Doctrine_Query();

        return $query->select(
                                'dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador'
                        )->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere(
                                'tn.uritiponomenclador =?', $uritiponomenclador->uri
                        )->addWhere(
                        'dn.iddatosnomenclador = ?', $uritiponomenclador->idestado
                )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNomIdestadoDadoUri($uritiponomenclador) {
        $query = new Doctrine_Query();

        return $query->select(
                                'dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador'
                        )->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere(
                                'tn.uritiponomenclador =?', $uritiponomenclador->uri
                        )->addWhere(
                        'dn.uridatosnomenclador = ?', $uritiponomenclador->uriestado
                )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNom($uritiponomenclador, $uridato = false, $excluir = false) {

        $query = new Doctrine_Query();

        $query->select(
                        'dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador'
                )->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                ->addWhere(
                        'tn.uritiponomenclador =?', $uritiponomenclador
        );
        if ($uridato) {
            $query->addWhere('dn.uridatosnomenclador =?', $uridato);
        }
        if ($excluir) {
            $query->addWhere('dn.uridatosnomenclador <>?', $excluir);
        }
        $query->orderBy('dn.iddatosnomenclador');
        return $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function getDatosNomPorUriTipoNomCtrlProc($uritiponomenclador
    ) {
        $query = new Doctrine_Query();
        return $query->select(
                                "dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador "
                        )->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere(
                                'tn.uritiponomenclador =? ', array($uritiponomenclador)
                        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    //Utilizado como servicio
    public function getDatosNomPorUriDatosNom($uridatosnomenclador) {
        $query = new Doctrine_Query();

        return $query->select(
                                'dn.iddatosnomenclador,dn.denominacion,dn.uridatosnomenclador,dn.idtiponomenclador'
                        )->from('NomDatosnomenclador dn')
                        ->addwhere(
                                "lower(dn.uridatosnomenclador) = ? ", strtolower($uridatosnomenclador)
                        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function eliminar($nomenclador) {
        $nomenclador->delete();
        return 1;
    }

    public function obtenerIdTiponomencladorPadreById($id) {
        $query = new Doctrine_Query();
        $data = $query->select("ndn.idtiponomenclador")
                        ->from("NomDatosnomenclador ndn")->where("ndn.0=0?1.", $id)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $data;
    }

    public function getDatosNomPorUriTipoNom1Nivel($uritiponomenclador) {
        $query = new Doctrine_Query();
        return $query->select(
                                'dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador'
                        )->from('NomDatosnomenclador dn')->innerJoin('dn.NomTiponomenclador tn')
                        ->where(
                                'tn.uritiponomenclador =? and dn.cantascendente = 0', $uritiponomenclador
                        )->orderBy('upper(dn.denominacion)')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function obtenerDatosNomencladorByDenominacion($denominacion) {
        $query = new Doctrine_Query();
        $temp = $query->select(
                                'm.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion'
                        )->from('NomDatosnomenclador m')->where('m.denominacion=?', $denominacion)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $temp;
    }

    public function obtenerDatosNomencladorByDenominacionTipoNom($denominacion, $idtiponomenclador
    ) {
        $query = new Doctrine_Query();
        $temp = $query->select(
                                'm.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion'
                        )->from('NomDatosnomenclador m')
                        ->where(
                                'm.denominacion=? AND m.idtiponomenclador = ?', array($denominacion, $idtiponomenclador)
                        )//->getSqlQuery();
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $temp;
    }

    public function eliminarById($iddatosnomenclador) {
        $query = new Doctrine_Query();
        $query->delete()
                ->from('NomDatosnomenclador m')
                ->where('m.iddatosnomenclador=?', $iddatosnomenclador)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function updateCantdescendente($cantdesc, $id) {

        $arrayParams = array();
        $arrayParams[] = $cantdesc;
        $arrayParams[] = $id;
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "UPDATE mod_planificacion.nom_datosnomenclador
        SET cantdescendente =? WHERE iddatosnomenclador =?";
        $res = $conn->execute($sqlQuery, $arrayParams);
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCantdescendenteById($id) {
        $query = new Doctrine_Query();
        $cantdesc = $query->select("ndn.cantdescendente")
                        ->from("NomDatosnomenclador ndn")
                        ->where("ndn.iddatosnomenclador=?", $id)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $cantdesc;
    }

    public function obtenerCantascendenteById($id) {
        $query = new Doctrine_Query();
        $cantasc = $query->select("ndn.cantascendente")
                        ->from("NomDatosnomenclador ndn")
                        ->where("ndn.iddatosnomenclador=?", $id)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $cantasc;
    }

    public function ObtenerDatosDadoArrayIdDatosNom($arrayIddatosnom) {
        $query = new Doctrine_Query();
        return $query->select('m.denominacion,m.iddatosnomenclador')
                        ->from('NomDatosnomenclador m')
                        ->whereIn('m.iddatosnomenclador', $arrayIddatosnom)->execute()->toArray();
    }

    public function getDatosNomEstadosUri() {
        $query = new Doctrine_Query();

        return $query->select('dn.uridatosnomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    public function ObtenerIDDatosNom($dendat) {
        $con = Doctrine_Manager::connection();
        $query = " SELECT m.iddatosnomenclador
       FROM mod_planificacion.nom_datosnomenclador m
       WHERE  m.denominacion LIKE '" . $dendat . "';";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function getDatosNomPorUriTipoNomArray($uritiposnomencladores, $uridato = false) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT tn.uritiponomenclador,
                        dn.iddatosnomenclador
                    FROM mod_planificacion.nom_tiponomenclador tn
                         INNER JOIN mod_planificacion.nom_datosnomenclador dn ON tn.idtiponomenclador = dn.idtiponomenclador
                    WHERE tn.uritiponomenclador IN ($uritiposnomencladores) AND
                          dn.uridatosnomenclador = '$uridato'";
        $res = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getIddatosnom($denom, $idtipo) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT iddatosnomenclador
                  FROM mod_planificacion.nom_datosnomenclador
                  where idtiponomenclador = $idtipo and denominacion='$denom'";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }


}
