<?php

/***
 * Class NomTipomedioModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class TablaModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomConcepto();
    }

    /**
     * Descripción del método: Borrar la instancia vieja que poseia el modelo
     *
     * @copyright Copyright (c) 2013 xetid
     */
    public function Instancia()
    {
        $this->instance = null;
    }

    /**
     * Descripción del método: Busca los campos a los que tiene permiso el concepto especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     *
     * @param $idTipo
     *
     * @return array Retorna un arreglo con todos los datos de los permisos asociados
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarConexiones($idTipo)
    {
        $perfil = Util::getPerfilGlobal();
        $idusuario = $perfil->idusuario;
        $restrigido = DatUsuarioConcepto::tieneRestricciones();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $where = "r.idpadre = $idTipo";
        $innerRestricciones = '';
        if ($restrigido) {
            $innerRestricciones
                = "INNER JOIN mod_estructuracomp.dat_usuarioconcepto uc ON (uc.idconcepto = eav.idconcepto
                AND uc.idusuario = $idusuario AND uc.adicionar = 1)";
        }
        $query = "Select distinct eav.idconcepto as id,
                eav.denominacion as text,
                eav.*,i.icono as icon
                from mod_estructuracomp.nom_relacion r
                inner join mod_estructuracomp.nom_concepto eav on (r.idhijo = eav.idconcepto)
                $innerRestricciones
                inner join mod_estructuracomp.nom_icono i on (i.idicono = eav.idicono)
                where $where
                order by eav.denominacion";
        $result = $conn->fetchAll($query);

        return $result;
    }
}
