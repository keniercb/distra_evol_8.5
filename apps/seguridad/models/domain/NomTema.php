<?php

/**
 * Clase dominio de NomTema.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class NomTema extends BaseNomTema
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'SegUsuario', 
            array('local' => 'idtema', 'foreign' => 'idtema')
        );
    }

    /**
     * Funcion usada para listar los temas por lotes.
     *
     * @param integer $limit Limite
     * @param integer $start Comienzo
     * @return Doctrine_Collection
     */
    static public function cargarnomtema($limit, $start)
    {
        return Doctrine_Query::create()->select(
            't.idtema,t.denominacion,t.abreviatura, t.descripcion'
        )
            ->from('NomTema t')
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    /**
     * Funcion usada para determinar la cantidad de temas que han sido 
     * registrados.
     *
     * @return integer Cantidad de temas registrados.
     */
    static public function obtenercantnomtema()
    {
        return Doctrine_Query::create()
            ->select('COUNT(idtema) AS cant')
            ->from('NomTema')
            ->fetchOne()->cant;
    }

    /**
     * Funcion usada para validar que no se repita un tema.
     *
     * @param string $campo Denominacion del campo para aplicar el filtro.
     * @param string $valor Valor del campo para aplicar el filtro.
     * @param integer $idtema Identificador del tema. Por defecto NULL.
     * @return integer Cantidad de elementos que cumplen con las condiciones.
     */
    static public function comprobartema($campo, $valor, $idtema = null)
    {
        if ($idtema) {
            $where = "$campo = ? AND idtema <> ?";
            $filtro = array($valor, $idtema);
        } else {
            $where = "$campo = ?";
            $filtro = array($valor);
        }
        return Doctrine_Query::create()
            ->select('COUNT(idtema) AS cant')
            ->from('NomTema')
            ->where($where, $filtro)
            ->fetchOne()->cant;
    }

    /**
     * Funcion usada para listar todos los temas registrados en el sistema.
     *
     * @return array Listado de temas.
     */
    static public function cargarcombotema()
    {
        return Doctrine_Query::create()->select('t.idtema,t.denominacion')
            ->from('NomTema t')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

}