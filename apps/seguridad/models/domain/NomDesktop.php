<?php

/**
 * @name NomDesktop - Clase dominio NomDesktop.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class NomDesktop extends BaseNomDesktop
{

    /**
     * @method setUp - Función principal de la clase donde se generan las
     *  relaciones con otros modelos.
     * @return void.
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'SegUsuario',
            array('local' => 'iddesktop', 'foreign' => 'iddesktop')
        );
    }

    /**
     * @method cargarnomdesktop - Función usada para obtener el listado 
     * de escritorios.
     * @param integer $limit - Limite.
     * @param integer $start - Comienzo.
     * @return Doctrine_Collection
     */
    public static function cargarnomdesktop($limit, $start)
    {
        return Doctrine_Query::create()->select(
            'd.iddesktop,d.denominacion,d.abreviatura, d.descripcion'
        )
            ->from('NomDesktop d')
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    /**
     * @method obtenercantnomdesktop - Cuenta la cantidad de escritorios 
     * que hay creados.
     * @return integer - Cantidad.
     */
    public static function obtenercantnomdesktop()
    {
        return Doctrine_Query::create()->select('COUNT(iddesktop) AS cant')
            ->from('NomDesktop')
            ->fetchOne()
            ->cant;
    }

    /**
     * @method cargarcombodesktop - Función usada para retornar un listado
     *  con todos los escritorios creados.
     * @return array - Listado de escritorios.
     */
    public static function cargarcombodesktop()
    {
        return Doctrine_Query::create()->select('iddesktop,denominacion')
            ->from('NomDesktop')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @method verificarDesktop - Funcion genérica para validar que la 
     * denominación o abreviatura de un escritorio no se repita.
     * @param string $campo - Nombre del campo por el que se realizará 
     * la busqueda.
     * @param string $valor - Valor.
     * @param integer $iddesktop - Identificador del escritorio | NULL
     * @return integer
     */
    public static function verificarDesktop($campo, $valor, $iddesktop)
    {
        if ($iddesktop) {
            $where = "$campo = ? AND iddesktop <> ?";
            $filtro = array($valor, $iddesktop);
        } else {
            $where = "$campo = ?";
            $filtro = array($valor);
        }
        return Doctrine_Query::create()->select('COUNT(iddesktop) AS cant')
            ->from('NomDesktop')
            ->where($where, $filtro)
            ->fetchOne()->cant;
    }

}