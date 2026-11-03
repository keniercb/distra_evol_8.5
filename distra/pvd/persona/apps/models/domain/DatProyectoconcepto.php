<?php

class DatProyectoconcepto extends BaseDatProyectoconcepto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasOne('DatProyectoconcepto', array('local' => 'idpadre', 'foreign' => 'idproyectoconcepto'));
        $this->hasMany('DatProyectorol', array('local' => 'idproyectoconcepto', 'foreign' => 'idproyectoconcepto'));
        $this->hasMany('DatProyectocampo', array('local' => 'idproyectoconcepto', 'foreign' => 'idproyectoconcepto'));
        $this->hasMany('DatProyectoconcepto', array('local' => 'idproyectoconcepto', 'foreign' => 'idpadre'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idproyectoconcepto
     *
     * @return Doctrine_Record
     */
    public function getById($idproyectoconcepto, $objR = false)
    {
        $projects = $this->reflectArray($idproyectoconcepto);
        if (count($projects) > 0) {
            $query = Doctrine_Query::create()->from('DatProyectoconcepto')->whereIn('idproyectoconcepto', $projects);

            return ($objR) ? $query->execute() : $query->execute()->toArray();
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function verifExist($denominacion)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('p.*')->from('DatProyectoconcepto')->where('denominacion=?', array($denominacion))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            if (count($result)) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene los conceptos o campos de un proyecto
     *
     * @param $idproyecto Identificador del proyecto
     * @param $idpadre    Identificador del nodo padre
     *
     * @return array Listado de elementos
     */
    public function getConcepts($idproyecto, $idpadre)
    {
        $queryObj = Doctrine_Query::create()->select(
            "pc.idproyectoconcepto,pc.idproyectoconcepto as id, pc.idpadre, 
                pc.denominacion as text, pc.descripcion as qtip, pc.tipo, pc.orden,
                pc.propiedades,(CASE WHEN pc.tipo = 3 THEN true ELSE false END) as leaf,
                pc.iconcls as iconCls, false as expanded, pc.codigo, pc.cmpempleado, dp.idproyecto, dp.fdatos"
        )->from('DatProyectoconcepto pc')->leftJoin('pc.DatProyecto dp')->where('pc.idproyecto = ?', $idproyecto)
            ->orderBy('pc.tipo, pc.orden');
        if ($idpadre == 'root') {
            //Filtro para los nodos raices
            $queryObj->addWhere('pc.idproyectoconcepto = pc.idpadre');
        } else {
            if (!empty($idpadre)) {
                //Filtro para nodos hijos
                $queryObj->addWhere('pc.idpadre = ? AND pc.idproyectoconcepto <> pc.idpadre', $idpadre);
            }
        }

        return $queryObj->fetchArray();
    }

    public function getTreeConceptByRol($idrol, $idproyecto)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dpc.denominacion as text, dpc.descripcion as qtip, dpc.tipo, dpc.orden, dpc.iconcls as iconCls,
                pc.propiedades, dpr.idproyectorol as idproyectorol, dpr.activo as activo, dpr.obligatorio as oblig,
				dpr.add as add, dpr.mod as mod, dpr.del as del, dp.idproyecto as idproyecto, dp.fdatos as fdatos"
            )->from('DatProyectoconcepto dpc')->leftJoin('dpc.DatProyecto dp')->leftJoin(
                "dpc.DatProyectorol dpr ON (dpr.idproyectoconcepto = dpc.idproyectoconcepto AND dpr.idrol IN (" .
                implode(',', Utiles::reflectArray($idrol)) . '))'
            )->where("dpc.idproyecto = '$idproyecto'")->orderBy('dpc.tipo, dpc.orden');

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getConceptosAutorizados($idrol, $idproyecto)
    {
        try {
            return Doctrine_Query::create()->select('dpc.denominacion, dpc.getdata')->from('DatProyectoconcepto dpc')
                ->leftJoin(
                    "dpc.DatProyectorol dpr ON (dpr.idproyectoconcepto = dpc.idproyectoconcepto AND dpr.idrol IN (" .
                    implode(',', Utiles::reflectArray($idrol)) . '))'
                )->where("dpc.idproyecto = ? and dpc.tipo = 1 and  dpr.activo = 1", $idproyecto)->orderBy(
                    'dpc.orden'
                )->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCanChilds($idpadre)
    {
        try {
            $query = Doctrine_Query::create()->from('DatProyectoconcepto')->where(
                'idpadre = ? AND idproyectoconcepto <> idpadre', $idpadre
            );

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}