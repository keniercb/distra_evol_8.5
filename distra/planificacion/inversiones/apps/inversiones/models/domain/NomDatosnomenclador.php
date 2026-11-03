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

        $this->hasOne('NomTiponomenclador', array('local' => 'idtiponomenclador', 'foreign' => 'idtiponomenclador'));
        $this->hasMany('DatDesgloseentidad', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('NomIndicador', array('local' => 'iddatosnomenclador', 'foreign' => 'naturaleza'));
        $this->hasMany(
                'DatEntidaddatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany('DatObra', array('local' => 'iddatosnomenclador', 'foreign' => 'idprograma'));
        $this->hasMany(
                'DatObradatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatDatosnomencladoractividad', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'DatEsptiponomdatosnomcartatec', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatCartatecindicadordatosnom', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany('DatCaractcampo', array('local' => 'iddatosnomenclador', 'foreign' => 'idtiporiego'));
        $this->hasMany(
                'DatActespcomportamiento', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'DatDatosnomencladordatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomencladorpadre')
        );
        $this->hasMany(
                'DatDatosnomencladordatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomencladorhijo')
        );
        $this->hasMany(
                'DatModelodatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany('TempInsindicador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempInsactividad', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('TempInsnorma', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));

        $this->hasMany(
                'TempInsindicadorviayos', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'TempIndicadorprecio', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );

        $this->hasMany('DatDocumentoaprobacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idoperacion'));
        $this->hasMany(
                'DatDocumentoaprobacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idtipoaprobacion')
        );
        $this->hasMany('NomEjercicioplanificacion', array('local' => 'iddatosnomenclador', 'foreign' => 'idestado'));
        $this->hasMany(
                'DatProcesofuncionalidadestado', array('local' => 'iddatosnomenclador', 'foreign' => 'idestado')
        );
        $this->hasMany(
                'DatDesglosedatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador')
        );
    }

    public function ObtenerDatosNomenclador($idtiponomenclador, $dataindex) {
        $alias = ' nom_datosnomenclador_denominacion';
        if ($dataindex) {
            $alias = $dataindex;
        }
        $query = new Doctrine_Query ();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as ' . $alias)
                ->from('NomDatosnomenclador m')
                ->where('m.idtiponomenclador=?', $idtiponomenclador)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $temp;
    }

    public function ObtenerDatosprimeto($idtiponomenclador) {
        $guion = '-';
        $query = new Doctrine_Query ();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.idtiponomenclador=? AND m.denominacion=?', array($idtiponomenclador, $guion))
                        ->execute()->getFirst();
        return $temp;
    }

    public function getDatosNomPorIdTipoNom($idtiponomenclador) {
        $query = new Doctrine_Query ();
        return $query->select('m.iddatosnomenclador, m.denominacion as denominacionnom')
                        ->from('NomDatosnomenclador m')
                        ->where('m.idtiponomenclador=?', $idtiponomenclador)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function ObtenerDatosDadoIdDatosNom($iddatosnomenclador) {
        $query = new Doctrine_Query ();

        return $query->select('m.denominacion')
                        ->from('NomDatosnomenclador m')
                        ->where('m.iddatosnomenclador=?', $iddatosnomenclador)
                        ->execute()->toArray();
    }

    public function listarOqsatisface($idtiponomenclador) {
        $query = new Doctrine_Query ();
        $temp = $query->from('NomDatosnomenclador d')
                ->where('d.idtiponomenclador=?', $idtiponomenclador)
                ->execute()
                ->toArray();
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

        $query
                ->where($where)
                ->addWhere('ntn.uritiponomenclador=?', $parametros['uri'])
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);


        return $query->execute();
    }

    public function getDatosNomPorUriTipoNomIdestado($uritiponomenclador) {
        $query = new Doctrine_Query ();

        if ($uritiponomenclador->idestado) {
            $query->addWhere("dn.iddatosnomenclador <> " . $uritiponomenclador->idestado . "");
        }
        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', $uritiponomenclador->uri) //estadoimportar
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function getDatosNomPorUriTipoNomIdestadoDadoEstado($uritiponomenclador) {
        $query = new Doctrine_Query ();

        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', $uritiponomenclador->uri) //estadoimportar
                        ->addWhere('dn.iddatosnomenclador = ?', $uritiponomenclador->idestado)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function getDatosNomPorUriTipoNomIdestadoDadoUri($uritiponomenclador) {
        $query = new Doctrine_Query ();

        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', $uritiponomenclador->uri) //estadoimportar
                        ->addWhere('dn.uridatosnomenclador = ?', $uritiponomenclador->uriestado)
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function getDatosNomPorUriTipoNom($uritiponomenclador) {
        $query = new Doctrine_Query ();

        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =?', $uritiponomenclador) //estadoimportar
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function getDatosNomPorUriTipoNomCtrlProc($uritiponomenclador, $parametros) {
        $query = new Doctrine_Query ();

        return $query->select("dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador ")
                        ->from('NomDatosnomenclador dn')
                        ->innerJoin('dn.NomTiponomenclador tn')
                        ->addWhere('tn.uritiponomenclador =? ', array($uritiponomenclador)) //estadoimportar
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function getDatosNomPorUriDatosNom($uridatosnomenclador) {
        $query = new Doctrine_Query ();
        return $query->select('dn.iddatosnomenclador,dn.denominacion,dn.uridatosnomenclador,dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->addwhere("lower(dn.uridatosnomenclador) = ? ", strtolower($uridatosnomenclador))//estadoimportar
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function eliminar($nomenclador) {
        $nomenclador->delete();
        return 1;
    }

    public function obtenerIdTiponomencladorPadreById($id) {
        $query = new Doctrine_Query ();
        $data = $query->select("ndn.idtiponomenclador")
                ->from("NomDatosnomenclador ndn")
                ->where("ndn.0=0?1.", $id)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function getDatosNomPorUriTipoNom1Nivel($uritiponomenclador) {
        $query = new Doctrine_Query ();
        return $query->select('dn.iddatosnomenclador, dn.denominacion,dn.uridatosnomenclador, dn.idtiponomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->innerJoin('dn.NomTiponomenclador tn')
                        ->where('tn.uritiponomenclador =? and dn.cantascendente = 0', $uritiponomenclador) //estadoimportar
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function obtenerDatosNomencladorByDenominacion($denominacion) {
        $query = new Doctrine_Query ();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion')
                ->from('NomDatosnomenclador m')
                ->where('m.denominacion=?', $denominacion)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $temp;
    }

    public function obtenerDatosNomencladorByDenominacionTipoNom($denominacion, $idtiponomenclador) {
        $query = new Doctrine_Query ();
        $temp = $query->select('m.iddatosnomenclador, m.denominacion as nom_datosnomenclador_denominacion')
                ->from('NomDatosnomenclador m')
                ->where('m.denominacion=? AND m.idtiponomenclador = ?', array($denominacion, $idtiponomenclador))
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $temp;
    }

    public function eliminarById($iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $query->delete()
                ->from('NomDatosnomenclador m')
                ->where('m.iddatosnomenclador=?', $iddatosnomenclador)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
    }

    public function updateCantdescendente($cantdesc, $id) {

        $array_params = array();
        $array_params[] = $cantdesc;
        $array_params[] = $id;
        $conn = Doctrine_Manager::connection();
        $sql_query
                = "UPDATE mod_planificacion.nom_datosnomenclador
        SET cantdescendente =?
        WHERE iddatosnomenclador =?";
        $res = $conn->execute($sql_query, $array_params);
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCantdescendenteById($id) {
        $query = new Doctrine_Query ();
        $cantdesc = $query->select("ndn.cantdescendente")
                ->from("NomDatosnomenclador ndn")
                ->where("ndn.iddatosnomenclador=?", $id)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $cantdesc;
    }

    public function obtenerCantascendenteById($id) {
        $query = new Doctrine_Query ();
        $cantasc = $query->select("ndn.cantascendente")
                ->from("NomDatosnomenclador ndn")
                ->where("ndn.iddatosnomenclador=?", $id)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $cantasc;
    }

    public function ObtenerDatosDadoArrayIdDatosNom($array_iddatosnom) {
        $query = new Doctrine_Query ();
        return $query->select('m.denominacion,m.iddatosnomenclador')
                        ->from('NomDatosnomenclador m')
                        ->whereIn('m.iddatosnomenclador', $array_iddatosnom)
                        ->execute()->toArray();
    }

    public function getDatosNomEstadosUri() {
        $query = new Doctrine_Query ();

        return $query->select('dn.uridatosnomenclador')
                        ->from('NomDatosnomenclador dn')
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();
    }

    public function ObtenerIDDatosNom($dendat) {
        $con = Doctrine_Manager::connection();
        $query = " SELECT m.iddatosnomenclador
       FROM mod_planificacion.nom_datosnomenclador m
         
       WHERE  m.denominacion LIKE '" . $dendat . "';";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

}
?>

