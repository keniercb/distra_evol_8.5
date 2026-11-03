<?php 
class NomCausa extends BaseNomCausa
 { 
   public function setUp() 
    {   parent::setUp();
        $this->hasOne('DatCausasreporteausencia', array('local' => 'idcausa', 'foreign' => 'idcausa'));
    } 
 
  
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomCausa')->execute ();        
          return $result->toArray();
    }

    public function Buscar($idtipodocidentidad)
    {
        $temp = $this->conn->getTable('NomCausa')->find($idtipodocidentidad);
        return $temp->toArray();
    }

    public function GetPorLimite()
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }
   

    public function GetPorLimiteAsist()
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }

    public function GetPorLimiteAsistSesiones()
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('((g.tieneentradasalida = 1 ) or (g.tieneentradasalida = 0 and g.tieneperiodo = 0))
                        or (g.tieneentradasalida is null and g.tieneperiodo is null)')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimiteAsistBySesiones()
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->andWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('(g.tieneperiodo = 1) or (g.tieneentradasalida is null and g.tieneperiodo is null)')
            ->execute();
        return $result->toArray();
    }

    public function GetCausasCat($idcategoria)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa g')
            ->where('idcategoria = ?', $idcategoria)
            ->execute ();
        return $result->toArray();
    }

    public static function getcantCausasByCategoria($idcategoria) {
          //Devolviendo la cantidad total
        return Doctrine_Query::create()
            ->select('COUNT(idcausa) AS cantidad')
            ->from('NomCausa')
            ->where('idcategoria is null or idcategoria = ?', $idcategoria)
            ->addWhere('fhasta is null or fhasta >= CAST(now() as date)')
            ->fetchOne()
            ->cantidad;
    }

    public static function getcantCausasByCategoriaSesiones($idcategoria) {
        //Devolviendo la cantidad total
        return Doctrine_Query::create()
            ->select('COUNT(idcausa) AS cantidad')
            ->from('NomCausa')
            ->where('idcategoria is null or idcategoria = ?', $idcategoria)
            ->addWhere('fhasta is null or fhasta >= CAST(now() as date)')
            ->addWhere('((tieneentradasalida = 1 ) or (tieneentradasalida = 0 and tieneperiodo = 0))
                        or (tieneentradasalida is null and tieneperiodo is null)')
            ->fetchOne()
            ->cantidad;
    }

    public static function getcantCausasByCategoriaBySesiones($idcategoria) {
        //Devolviendo la cantidad total
        return Doctrine_Query::create()
            ->select('COUNT(idcausa) AS cantidad')
            ->from('NomCausa')
            ->where('idcategoria is null or idcategoria = ?', $idcategoria)
            ->addWhere('fhasta is null or fhasta >= CAST(now() as date)')
            ->addWhere('(tieneperiodo = 1) or (tieneentradasalida is null and tieneperiodo is null)')
            ->fetchOne()
            ->cantidad;
    }

    public function GetCausasByCategoria($idcategoria)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->addWhere('idcategoria is null or idcategoria = ?', $idcategoria)
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }

    public function GetCausasByCategoriaSesiones($idcategoria)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->addWhere('idcategoria is null or idcategoria = ?', $idcategoria)
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('((g.tieneentradasalida = 1 ) or (g.tieneentradasalida = 0 and g.tieneperiodo = 0))
                        or (g.tieneentradasalida is null and g.tieneperiodo is null)')
            ->execute ();
        return $result->toArray();
    }

    public function GetCausasByCategoriaBySesiones($idcategoria)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = g.idcausa')
            ->addWhere('idcategoria is null or idcategoria = ?', $idcategoria)
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('(g.tieneperiodo = 1) or (g.tieneentradasalida is null and g.tieneperiodo is null)')
            ->execute ();
        return $result->toArray();
    }

    public function GetByLimithijos($id)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = ?', $id)
            ->addWhere('g.idcausa <> g.idpadre')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }

    public function GetByLimithijosAsist($id)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = ?', $id)
            ->addWhere('g.idcausa <> g.idpadre')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }

    public function GetByLimithijosAsistSesiones($id)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = ?', $id)
            ->addWhere('g.idcausa <> g.idpadre')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('((g.tieneentradasalida = 1 ) or (g.tieneentradasalida = 0 and g.tieneperiodo = 0))
                        or (g.tieneentradasalida is null and g.tieneperiodo is null)')
            ->execute ();
        return $result->toArray();
    }

    public function GetByLimithijosAsistBySesiones($id)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("g.*,((
                    SELECT COUNT(w.idcausa)
                    FROM NomCausa w
                    WHERE w.idpadre = g.idcausa and w.idcausa <> w.idpadre) = 0) as leaf")
            ->from('NomCausa g')
            ->where('g.idpadre = ?', $id)
            ->addWhere('g.idcausa <> g.idpadre')
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('(g.tieneperiodo = 1) or (g.tieneentradasalida is null and g.tieneperiodo is null)')
            ->execute ();
        return $result->toArray();
    }

    public function GethijosNoCategoria($id)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa g')
            ->where('idpadre = ?', $id)
            ->addWhere('idcategoria is null')
            ->addWhere('idcausa <> ?', $id)
            ->execute ();
        return $result->toArray();
    }

    public function getDenomCausa()
    {
        $query = Doctrine_Query::create()
            ->select('g.denominacion')
            ->from('NomCausa g');
        return $query->execute()->toArray();
    }

    public function getHijos($idcausa)
    {
        $query = Doctrine_Query::create()
            ->select('g.idcausa')
            ->from('NomCausa g')
            ->where('idpadre = ?', $idcausa)
            ->addWhere('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->addWhere('idcausa <> ?', $idcausa);
        return $query->execute()->toArray();
    }


    public function GetAllFind($criterio)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa td')
            ->where("td.denominacion ilike '%".$criterio."%'")
            ->execute ();
        return $result->toArray();
    }

    public function GetByLimitFind($criterio)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa')
            ->where("denominacion ilike '%".$criterio."%'")
            ->addWhere('fhasta is null or fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }

    public function GetCausas()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa g')
            ->where('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->execute ();
        return $result->toArray();
    }

    public function GetCausasDescuentan()
    {
        $query = new Doctrine_Query ();
        $result = $query->select('g.idcausa')
            ->from('NomCausa g')
            ->where('g.fhasta is null or g.fhasta >= CAST(now() as date)')
            ->andWhere('afectasalario = ?', 1)
            ->execute ();
        return $result->toArray();
    }

    public function CausaDescuenta($idcausa)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa')
            ->where('idcausa = ?', $idcausa)
            ->addWhere('descuenta = ?', 1)
            ->execute ();
        return $result->toArray();
    }

    public function GetCausasById($idcausa)
    {
        $query = Doctrine_Query::create()
            ->select('g.denominacion')
            ->from('NomCausa g')
            ->addWhere('g.idcausa = ?', $idcausa);
        return $query->execute()->toArray();
    }

    public function GetCausaByCategoria($idcategoria)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomCausa')
            ->where('idcategoria = ?', $idcategoria)
            ->execute ();
        return $result->toArray();
    }


    public function GetHojasAndRoots()
    {
        $query = Doctrine_Query::create()
            ->select('*')
            ->from('NomCausa c')
            ->where('c.idcausa not in (SELECT c1.idpadre FROM NomCausa c1)')
            ->orWhere('c.idcategoria is not null');
        return $query->execute()->toArray();
    }

    public function GetRootsCategoria($categoria)
    {
        $query = Doctrine_Query::create()
            ->select('*')
            ->from('NomCausa c')
            ->where('c.idcausa = c.idpadre')
            ->addWhere('c.fhasta is null or c.fhasta >= CAST(now() as date) and c.afectasalario = 1');
        if($categoria)
            $query->andWhere('c.idcategoria is not null');
        return $query->execute()->toArray();
    }

    public function GetLeafs()
    {
        $query = Doctrine_Query::create()
            ->select('*')
            ->from('NomCausa c')
            ->where('((SELECT COUNT(w.idcausa) FROM NomCausa w WHERE w.idpadre = c.idcausa and w.idcausa <> w.idpadre) = 0)')
            ->addWhere('c.fhasta is null or c.fhasta >= CAST(now() as date)');
        return $query->execute()->toArray();
    }

    public function GetLeafsDescuentan()
    {
        $query = Doctrine_Query::create()
            ->select('*')
            ->from('NomCausa c')
            ->where('((SELECT COUNT(w.idcausa) FROM NomCausa w WHERE w.idpadre = c.idcausa and w.idcausa <> w.idpadre) = 0) and c.afectasalario = 1')
            ->addWhere('c.fhasta is null or c.fhasta >= CAST(now() as date)');
        return $query->execute()->toArray();
    }

}//fin clase 
?>


