<?php

/**
 * @name SegRolGrupo Clase dominio de acceso a grupos de roles.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0.0
 */
class SegRolGrupo extends BaseSegRolGrupo
{

    /**
     * @method setUp - Función principal de la clase donde se generan 
     * las relaciones con otros modelos.
     * @return void.
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegRol', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
    }

    /**
     * @method ObtenerGruposEnUso - Retorna un listado de grupos que estan
     *  asociados a roles usados por usuarios activos.
     * @param array $arrayDel - Listado de identificadores de roles.
     * @return array
     */
    public static function ObtenerGruposEnUso($arrayIds)
    {
        $query = Doctrine_Query::create();
        return $query->select("DISTINCT rg.idgrupo")
            ->from('SegRolGrupo rg')
            ->innerjoin('rg.SegRol r')
            ->innerjoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerjoin('eur.SegUsuario u')
            ->where('u.activo = ?', true)
            ->whereIn('rg.idgrupo', $arrayIds)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Función usada para eliminar un conjunto de relaciones.
     *
     * @method eliminarRelacion
     * @param integer $idrol - Identificador del rol.
     * @param array $arrayGruposDel - Listado de grupos.
     */
    public static function eliminarRelacion($idrol, $arrayGruposDel)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegRolGrupo')
            ->where('idrol = ?', $idrol)
            ->whereIn('idgrupo', $arrayGruposDel)
            ->execute();
    }
    /**
     * @method insertarrelacion - Función usada para asignar un rol a un grupo.
     * @param idrol - rol a asignar.
     * @param array $arrayGruposAdd  array con los idrol de los grupos destino.
     * @return void
     */
    public static function insertarrelacion($idrol, $arrayGruposAdd)
    {
        if (count($arrayGruposAdd) > 0) {
            foreach ($arrayGruposAdd as $idgrupo) {
                $objRolGrupo = new SegRolGrupo();
                $objRolGrupo->idrol = $idrol;
                $objRolGrupo->idgrupo = $idgrupo;
                $objRolGrupo->save();
            }
        }
    }

    /**
     * Retorna un listado de grupos asociados a roles.
     *
     * @method obtenerGruposRol
     * @param array $arrayIdrol - Arreglo de identificadores de rol.
     * @return array - Listado de identificadores de grupos.
     */
    public static function obtenerGruposRol($arrayIdrol)
    {
        $query = Doctrine_Query::create();
        return $query->select("DISTINCT rg.idgrupo")
            ->from('SegRolGrupo rg')
            ->whereIn('rg.idrol', $arrayIdrol)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Retorno la cantidad de grupos a los que pertenece el rol que
    sean diferentes de los que se pasan por parámetro.
     *
     * @method obtenerGruposNoRol
     * @param integer $idrol Identificador del rol.
     * @param array $arrayGruposDel Listado de identificadores de grupos.
     * @return integer Cantidad de grupos a los que pertenece el rol
     *                   diferentes a los entrados por parámetro.
     */
    public static function obtenerGruposNoRol($idrol, $arrayGruposDel)
    {
        $query = Doctrine_Query::create();
        $result = $query->select("COUNT(DISTINCT rg.idgrupo) as cantidad")
            ->from('SegRolGrupo rg')
            ->where('rg.idrol = ?', $idrol)
            ->whereNotIn('rg.idgrupo', $arrayGruposDel)
            ->execute();
        return $result[0]->cantidad;
    }

}