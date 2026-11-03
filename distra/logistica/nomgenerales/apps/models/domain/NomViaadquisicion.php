<?php

class NomViaadquisicion extends BaseNomViaadquisicion
{
    public function setUp()
    {
        $this->hasOne('DatViaadquisicionEntidad', array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion'));
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param String $alias
     * @param Array $parametros
     * @return \Doctrine_Query
     */
    private function GetWhere($query, $alias, $parametros)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        if ($parametros['denominacion']) {
            $query->addWhere("$alias.denominacion iLike '%{$parametros['denominacion']}%'");
        }
        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        return $query;
    }
    
    /**
     * @param Array $parametros
     * @return Array
     */
    public function GetDatos($parametros)
    {
        $query = new Doctrine_Query();

        $query->from('NomViaadquisicion va')
            ->addSelect(
                'va.idviaadquisicion, va.denominacion, va.idviaadquisicion as id, va.denominacion as text, '
                .'va.estado, false as leaf'
        );
        $query = self::GetWhere($query, 'va', $parametros);

        return $query->fetchArray();
    }

    /**
     * @param Array $parametros
     * @return Array
     */
    public function GetCantDatos($parametros)
    { 
        unset($parametros['start']);
        unset($parametros['limit']);
         
        $query = new Doctrine_Query();

        $query->from('NomViaadquisicion va');

        $query = self::GetWhere($query, 'va', $parametros);
       
        return $query->count();
    }
}