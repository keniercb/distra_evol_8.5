<?php
class DatPeriodoquincena extends BaseDatPeriodoquincena
 { 
   public function setUp() 
    {   parent::setUp();
    }

    public function getPeriodo($anno)
    {
        $query = Doctrine_Query::create()
            ->select('a.*')
            ->from('DatPeriodoquincena a')
            ->andWhere('a.anno = ?', $anno)
            ->orderBy("mes asc");
        return $query->execute()->toArray();
    }

    public function getPeriodoQuincenal($mes,$anno)
    {
        $query = Doctrine_Query::create()
            ->select('a.*')
            ->from('DatPeriodoquincena a')
            ->andWhere('a.anno = ?', $anno)
            ->andWhere("a.mes = ?", $mes);
        return $query->execute()->toArray();
    }

    public function eliminarPeriodo($mes,$anno)
    {
        try
        {
            $query = new Doctrine_Query ();
            $result = $query->delete()
                ->from('DatPeriodoquincena dp')
                ->where('dp.mes = ?', $mes)
                ->andWhere('dp.anno = ?', $anno)
                ->execute();
            return true;
        }
        catch (Exception $e)
        {
            throw $e;
        }

    }

    public function eliminarAllPeriodo($anno)
    {
        try
        {
            $query = new Doctrine_Query ();
            $result = $query->delete()
                ->from('DatPeriodoquincena dp')
                ->andWhere('dp.anno = ?', $anno)
                ->execute();
            return true;
        }
        catch (Exception $e)
        {
            throw $e;
        }
    }





}//fin clase 
?>
