<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatInvolucrados extends BaseDatInvolucrados {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomNivelinvolucrado', array('local' => 'idnivelinvolucrado',
            'foreign' => 'idnivelinvolucrado')
        );
        $this->hasMany(
                'DatArc', array('local' => 'idinvolucrado', 'foreign' => 'idarc',
            'refClass' => 'DatArcDatInvolucrados')
        );
        $this->hasMany(
                'DatElementosDatInvolucrados', array('local' => 'idinvolucrado', 'foreign' => 'idinvolucrado')
        );
        $this->hasMany(
                'DatCriterioDatInvolucrados', array('local' => 'idinvolucrado', 'foreign' => 'idinvolucrado')
        );
    }

    public function Buscar($consec) {
        $temp = $this->conn->getTable('DatInvolucrados')->find($consec);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query();
        $result = $query->from('DatInvolucrados')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query();
        $result = $query->from('DatInvolucrados')->limit($limite = 10)->offset(
                        $inicio = 0
                )->execute();
        return $result->toArray();
    }

    static public function GetResponsables() {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')->from('DatInvolucrados i')->where(
                        "i.tipoinvolucrado = 0"
                )->execute();
        return $result->toArray();
    }

    static public function GetResponsablesDadoIdUsuario($idusuario) {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')->from('DatInvolucrados i')->where(
                        "i.tipoinvolucrado = 0 AND i.idusuario = $idusuario"
                )->execute();
        return $result->toArray();
    }

    static public function GetInvolucradosDadoIdUsuario($idusuario) {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')->from('DatInvolucrados i')->where(
                        "i.tipoinvolucrado = 1 AND i.idusuario = $idusuario"
                )->execute();
        return $result->toArray();
    }

    static public function ExisteInvolucrado($idinvolucrado) {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')->from('DatInvolucrados i')->where(
                        'i.idinvolucrado = ?', $idinvolucrado
                )->execute();
        return $result->toArray();
    }

    static public function dameInvolucradosDadoIdUsuario($idUsuario) {
        $query = new Doctrine_Query();
        $result = $query->select('i.idinvolucrado')->from('DatInvolucrados i')
                        ->where("i.idusuario = $idUsuario")->execute();
        return $result->toArray();
    }

    static public function DameTodosDatosInvolucradosDadoIdUsuario($idUsuario) {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')
                ->from('DatInvolucrados i')
                ->where('i.idusuario = ?', $idUsuario)
                ->execute();
        return $result->toArray();
    }

    public function dameInvolucradoDadoIdGrupo($idGrupo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatInvolucrados i')->where(
                        "i.idgrupo = $idGrupo"
                )->execute();
        return $result->toArray();
    }

    public function dameInvolucrados() {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')->from('DatInvolucrados i')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    static public function existeInvolucradoPorUsuario($idUsuario) {
        $query = new Doctrine_Query();
        $result = $query->from('DatInvolucrados i')->where(
                        "i.idusuario = $idUsuario"
                )->count();
        return $result;
    }

    static public function existeInvolucradoPorGrupo($idgrupo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatInvolucrados i')->where(
                        "i.idgrupo = $idgrupo"
                )->count();
        return $result;
    }

    static public function existeInvolucradoPorIdInvolucrado($idinvolucrado) {
        $query = new Doctrine_Query();
        $result = $query->from('DatInvolucrados i')->where(
                        "i.idinvolucrado = $idinvolucrado"
                )->count();
        return $result;
    }

    public function DameDatosInvolucradosDadoIdusuario($idusuario) {
        $query = new Doctrine_Query();
        $result = $query
                ->select('i.*,vi.idvariable')
                ->from('DatVariableDatInvolucrados vi')
                ->innerJoin('vi.DatInvolucrados i')
                ->where('i.idusuario = ?', $idusuario)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function DameDatosInvolucradosDadoIdGrupo($idgrupo) {
        $query = new Doctrine_Query();
        $result = $query
                ->select("i.*,vi.*")
                ->from('DatInvolucrados i')
                ->innerJoin('i.DatVariableDatInvolucrados vi')
                ->where("i.idgrupo = $idgrupo")
                // ->setHydrationMode ( Doctrine :: HYDRATE_ARRAY )
                ->execute();
        return $result->toArray();
    }

    function modificarInvolucrado($idinvolucrado, $parametros) {
        $invol = Doctrine::getTable('DatArc')->find($idinvolucrado);
        if (is_object($invol)) {
            $invol->idinvolucrado = isset($parametros['idinvolucrado']) ? $parametros['idinvolucrado'] : $invol->$idinvolucrado;
            $invol->tipoinvolucrado = isset($parametros['tipoinvolucrado']) ? $parametros['tipoinvolucrado'] : $invol->$tipoinvolucrado;
            $invol->save();
            return true;
        }
        return false;
    }

    function involucradosDadoIdElemento($idelemento) {
        $cadena
                = "SELECT di.*,dedi.porcientocumplimiento,nn.dennomenclador,
            nn.idnomenclador
            FROM mod_objetivos.dat_involucrados di
            INNER JOIN mod_objetivos.dat_elementos_dat_involucrados dedi 
            ON (di.idinvolucrado = dedi.idinvolucrado)
            LEFT JOIN mod_objetivos.nom_tipoinvolucrado nti 
            ON (dedi.idtipoinvolucrado = nti.idtipoinvolucrado)
            LEFT JOIN mod_objetivos.nom_nomenclador nn 
            ON (nti.idtipoinvolucrado = nn.idnomenclador)
            WHERE dedi.idelemento = {$idelemento}";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        // print_r($cadena);die;
        return $result;
    }

    /* 	function involucradosDadoIdElemento($idelemento) {
      $query = new Doctrine_Query();
      $result = $query->select('i.*')
      ->from('DatInvolucrados i')
      ->innerJoin('i.DatElementosDatInvolucrados dedi')
      ->where("dedi.idelemento = $idelemento")
      ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
      ->execute();
      return $result;
      } */

    function involucradosDadoIdCriterio($idcriterio) {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')
                ->from('DatInvolucrados i')
                ->innerJoin('i.DatCriterioDatInvolucrados dedi')
                ->where("dedi.idcriteriomedida = $idcriterio")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    function involucradosDadoIdArc($idarc) {
        $query = new Doctrine_Query();
        $result = $query->select('i.*')
                ->from('DatInvolucrados i')
                ->innerJoin('i.DatArcDatInvolucrados dadi')
                ->where("dadi.idarc = $idarc")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    /**
     * Funcion para Comparar historial con version anterior
     */
    public function involucrados($idelemento) {
        $cadenaSELECT = " SELECT i.idusuario ";
        $cadenaFROM = " FROM mod_objetivos.dat_involucrados i
                INNER JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON(ei.idinvolucrado = i.idinvolucrado)";
        $cadenaWHERE = " WHERE ei.idelemento = {$idelemento} ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        //print_r($cadenaQUERY);die;
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}

//fin clase
