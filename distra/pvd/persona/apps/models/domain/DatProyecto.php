<?php

class DatProyecto extends BaseDatProyecto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatProyectoconcepto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('NomConfiguracion', array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param $idproyecto
     *
     * @return mixed
     */
    public function getById($idproyecto)
    {
        return Doctrine::getTable('DatProyecto')->find($idproyecto);
    }

    public function getPorLimite($limit, $start, $denominacion)
    {
        $query = Doctrine_Query::create()->select('p.idproyecto, p.denominacion, p.idconfiguracion, p.fdatos')->from(
            'DatProyecto p'
        )->limit($limit)->offset($start);
        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $query = ZendExt_IoC::getInstance()->reccomplejas->addDqlNomConfiguracion($query, 'p', 'nc', true);
        if (!empty($denominacion)) {
            $query->addWhere("p.denominacion ILIKE '%$denominacion%'");
        }

        return $query->fetchArray();
    }

    /**
     * Devuelve la cantidad total de proyectos
     *
     * @return Doctrine_Exception|Exception|int
     */
    public function GetCantListTodos($denominacion)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('p.*')->from('DatProyecto p')->count();
            //Para que no de error en el jenkins:
            $denominacion = null;
            return $result;

        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Verfica si existe un proyecto con el mismo identificador o la misma denominacion
     *
     * @param $idproyecto
     * @param $denominacion
     *
     * @return bool|Doctrine_Exception|Exception
     */
    public function verifExist($idproyecto, $denominacion)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('p.*')->from('DatProyecto p')->where(
                "idproyecto = ? OR denominacion = ? ", array($idproyecto, $denominacion)
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
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
     * Funcion para obtener toda la configuracion del proyecto
     *
     * @param $idproyecto
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getConfigProject($idproyecto)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dp.*, dpc.idproyectoconcepto, dpc.denominacion, dpc.descripcion, dpc.tipo, dpc.propiedades
                dpc.codigo, dpc.cmpempleado'
            )->from('DatProyecto dp')->innerJoin('dp.DatProyectoconcepto dpc')->where('dp.idproyecto = ?', $idproyecto);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function updateProyecto($idproyecto, $fdatos)
    {
        try {
            $q = Doctrine_Query::create()->update('DatProyecto')->where('idproyecto = ?', $idproyecto);
            if (isset($fdatos)) {
                $q->set('fdatos', '?', $fdatos ? 1 : 0);
            }

            return $q->execute();

        } catch (Exception $e) {
            throw $e;
        }
    }
}

