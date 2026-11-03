<?php

class NomOrganosatisface extends BaseNomOrganosatisface
{

    public function setUp()
    {
        parent::setUp();
//        $this->hasMany(
//            'DatIndicadorviaadquisicionorganosatisface',
//            array('local' => 'idorganosatisface', 'foreign' => 'idorganosatisface')
//        ); /* , 'refClass' => 'DatIndicadorviaadquisicionorganosatisface' */
//        $this->hasMany('NomOrganosatisface', array('local' => 'idorganosatisface', 'foreign' => 'idpadre'));
//        $this->hasMany(
//            'DatDesgviaadquisorgsat', array('local' => 'idorganosatisface', 'foreign' => 'idorganosatisface')
//        ); /* , 'refClass' => 'DatDesgviaadquisorgsat */
    }



//    public function obtenerOS()
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.idorganosatisface, n.denominacion')
//            ->from('NomOrganosatisface n')
//                ->orderby('n.denominacion')
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    public function ObtenerDenomOACEporId($idorganosatisface)
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.denominacion')
//            ->from('NomOrganosatisface n')
//            ->where('n.idorganosatisface=?', $idorganosatisface)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    public function ObtenerOACEporId($idorganosatisface)
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.idorganosatisface, n.denominacion,n.descripcion,n.color')
//            ->from('NomOrganosatisface n')
//            ->where('n.idorganosatisface=?', $idorganosatisface)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    public function listarOS($parametros, $start, $limit, $idpadre, $idarbol){
//        $query = new Doctrine_Query ();
//        $devolverPadre = ($idpadre == 0 ? "null as _parent" : "idpadre as _parent");
//        if ($parametros) {
//
//            foreach ($parametros as $p => $s) {
//                if ($s != null) {
//                    if ($p == 'denominacion') {
//                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
//                    } else {
//                        if ($p == 'descripcion') {
//                            $query->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
//                        }
//                    }
//                }
//            }
//        }
//
//        if ($idpadre) {
//            $query->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idorganosatisface ");
//            // $query_total->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idindicador ");
//
//            if ($idarbol != null) {
//                $query->addWhere("n.idarbol = " . $idarbol);
//                //$query_total->addWhere("n.idarbol = " . $idarbol);
//            }
//        } else {
//            $query->addWhere("n.idpadre = n.idorganosatisface");
//            //$query_total->addWhere("n.idpadre = n.idindicador");
//        }
//        $res = $query->select(
//            "n.idorganosatisface, n.denominacion,n.descripcion,n.color,n.idpadre," . $devolverPadre . ',(( ordender - ordenizq) = 1) as _is_leaf
//                               ,n.nivelarbol,n.ordender, n.ordenizq,n.idarbol'
//        )
//            ->from('NomOrganosatisface n')
//            ->orderby("upper(n.denominacion)")
//            ->offset($start)
//            ->limit($limit)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    function total($parametros, $idpadre, $idarbol){
//        $query = new Doctrine_Query ();
//        if ($parametros) {
//            foreach ($parametros as $p => $s) {
//                if ($s != null) {
//                    if ($p == 'denominacion') {
//                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
//                    } else {
//                        if ($p == 'descripcion') {
//                            $query->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
//                        }
//                    }
//                }
//            }
//        }
//
//        if ($idpadre) {
//            $query->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idorganosatisface ");
//
//
//            if ($idarbol != null) {
//                $query->addWhere("n.idarbol = " . $idarbol);
//            }
//        } else {
//            $query->addWhere("n.idpadre = n.idorganosatisface");
//        }
//
//
//        $query->select('COUNT(n.idorganosatisface)')
//            ->from('NomOrganosatisface n')
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//
//        $result = $query->count();
//        return $result;
//    }
//
//    function obtenerPordenom($denominacion)
//    {
//        $query = Doctrine_Query::create();
//        $query->from('NomOrganosatisface c')
//            ->where('lower(c.denominacion) = ?', array(strtolower($denominacion)))
//            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
//        $result = $query->execute();
//        return $result;
//    }
//
//    function obtenerOrgSatisface()
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.denominacion', 'n.idorganosatisface')
//            ->from('NomOrganosatisface n')
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    function obtenerOrgSatisfacePorNivel($nivel)
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.denominacion', 'n.idorganosatisface')
//            ->from('NomOrganosatisface n')
//            ->addWhere('n.nivelarbol = ?', $nivel)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    function obtenerOSDEById($idorganosatisface)
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.denominacion', 'n.idorganosatisface')
//            ->from('NomOrganosatisface n')
//            ->where('n.idpadre=? AND n.idorganosatisface <> n.idpadre', $idorganosatisface)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//
//    function obtenerGrupoById($idosde)
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.denominacion', 'n.idorganosatisface')
//            ->from('NomOrganosatisface n')
//            ->where('n.idpadre=?', $idosde)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    function obtenerEmpresaById($idgrupo)
//    {
//        $query = new Doctrine_Query ();
//        $res = $query->select('n.denominacion', 'n.idorganosatisface')
//            ->from('NomOrganosatisface n')
//            ->where('n.idpadre=?', $idgrupo)
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $res;
//    }
//
//    public function ObtenerDatosNomenclador()
//    {
//        $query = new Doctrine_Query ();
//        $result = $query->select("n.idorganosatisface,n.denominacion")
//            ->from('NomOrganosatisface n')
//            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
//            ->execute();
//        return $result;
//    }
//
//    public function ObtenerOrganoSatisfaceSustitucionImp()
//    {
//        $cadena
//            = "SELECT DISTINCT(os.idorganosatisface),os.idorganosatisface,os.denominacion
//				  FROM mod_planificacion.nom_organosatisface os
//				  INNER JOIN mod_planificacion.dat_indicadorviaadquisicionorganosatisface ivos ON ivos.idorganosatisface = os.idorganosatisface 
//				  INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva ON (iva.idindicador = ivos.idindicador AND iva.idviaadquisicion = ivos.idviaadquisicion) 
//				  INNER JOIN mod_planificacion.nom_viaadquisicion va ON va.idviaadquisicion = iva.idviaadquisicion 
//				  WHERE va.uriviaadquisicion = 'sustitucionimportaciones' ";
//        //die($cadena);
//        $objconexion = Doctrine_Manager :: connection();
//        $resultado = $objconexion->execute($cadena)->fetchAll();
//        return $resultado;
//
//
//    }
//        public function ObtenerOrganoSatisfaceVia($via){
//        $cadena
//            = "SELECT DISTINCT(os.idorganosatisface),os.idorganosatisface,os.denominacion
//				  FROM mod_planificacion.nom_organosatisface os
//				  INNER JOIN mod_planificacion.dat_indicadorviaadquisicionorganosatisface ivos ON ivos.idorganosatisface = os.idorganosatisface 
//				  INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva ON (iva.idindicador = ivos.idindicador AND iva.idviaadquisicion = ivos.idviaadquisicion) 
//				  INNER JOIN mod_planificacion.nom_viaadquisicion va ON va.idviaadquisicion = iva.idviaadquisicion 
//				  WHERE va.idviaadquisicion = $via ";
//        $objconexion = Doctrine_Manager :: connection();
//        $resultado = $objconexion->execute($cadena)->fetchAll();
//        return $resultado;
//
//
//    }

}

