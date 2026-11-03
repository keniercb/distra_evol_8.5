<?php

/**
 * Clase utilizada para compartimentar informacion, agregando a una consulta de tipo CI_DB_active_record los filtros correspondientes.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Restrict
 * @category   Framework.
 * @uses       ZendExt_Restrict_Query_Config, ZendExt_Restict_Query_Abstract, CI_DB_active_record.
 * @copyright  UCID
 * @version    1.0-0
 */
class ZendExt_Restrict_Query_CodeIgniterDBActiveRecord extends ZendExt_Restrict_Query_Abstract
{

    /**
     * Restringe una colsulta de tipo CI_DB_active_record de acuerdo a la configuracion de la compartimentacion.
     *
     * @param CI_DB_active_record           $queryObject       - Objeto consulta.
     * @param ZendExt_Restrict_Query_Config $restrictionConfig - Configuracion de la compartimentacion.
     *
     * @return CI_DB_active_record - Consulta compartimentada.
     */
    public function restrict($_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig, $idUsuario = null)
    {
        if (!$_queryObject instanceof CI_DB_active_record) {
            throw new ZendExt_Exception('ZEQCIDBAR001');
        }

        //Obteniendo los datos de la configuracion inicial de la compartimentacion.
        if (!$idUsuario) {
            $idUsuario = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario ?
                ZendExt_GlobalConcept::getInstance()->Perfil->idusuario
                : Zend_Registry :: getInstance()->session->perfil['idusuario'];
        }
        $inf = $_restrictionConfig->informationSource->alias;
        $idDom = $_restrictionConfig->domain->id;
        $idRestType = $_restrictionConfig->restrictionType->id;

        //Obteniendo el resto de los datos de la configuracion de la compartimentacion.
        $objConfComp = $this->getRestrictConfig($_restrictionConfig);

        //Generando un numero aleatorio para agregar a los alias.
        $rn = (string)rand(1, 10000);

        //Restringiendo la consulta
        $_queryObject->_escape_char = '';
        $_queryObject->select(
            "(((COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisodominio[1] & (niv{$rn}.revocaraccesodenegado | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][1], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisofueradominio[1] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][1], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisohijosdominio[1] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][1], '0')))) = '1') as insertar"
        )
            ->select(
                "(((COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisodominio[2] & (niv{$rn}.revocaraccesodenegado | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][2], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisofueradominio[2] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][2], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisohijosdominio[2] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][2], '0')))) = '1') as modificar"
            )
            ->select(
                "(((COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisodominio[3] & (niv{$rn}.revocaraccesodenegado | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][3], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisofueradominio[3] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][3], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisohijosdominio[3] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][3], '0')))) = '1') as eliminar"
            )
            ->select(
                "(((COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisodominio[4] & (niv{$rn}.revocaraccesodenegado | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][4], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisofueradominio[4] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][4], '0'))) |
							   (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & niv{$rn}.permisohijosdominio[4] & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][4], '0')))) = '1') as lectura"
            )
            ->join(
                "{$objConfComp['tablafuentedominio']} infcomp{$rn}",
                "infcomp{$rn}.{$objConfComp['campoidcriterioinf']} = {$idRestType} AND {$inf}.{$objConfComp['campoidfuente']} = infcomp{$rn}.{$objConfComp['campoidfuente']}",
                'inner'
            )
            ->join(
                "{$objConfComp['tabladominio']} dom3{$rn}", "dom3{$rn}.{$objConfComp['campoiddominio']} =  {$idDom}",
                'left'
            )
            ->join(
                "{$objConfComp['extensiontabladominio']} dom{$rn}",
                "dom{$rn}.{$objConfComp['campoiddominio']} = dom3{$rn}.{$objConfComp['campoiddominio']}", 'inner'
            )
            ->join(
                "mod_compartimentacion.dat_rolusuariodominio rol{$rn}",
                "rol{$rn}.idtipodominio = {$objConfComp['idtipodominio']} AND rol{$rn}.idusuario = {$idUsuario}", 'left'
            )
            ->join(
                "mod_compartimentacion.dat_confcompartimentacion niv{$rn}",
                "rol{$rn}.idtipodominio = niv{$rn}.idtipodominio AND rol{$rn}.idrolanalista = niv{$rn}.idrolanalista",
                'inner'
            );

        if ($objConfComp['tree']) {
            $_queryObject->join(
                "{$objConfComp['tabladominio']} dom2{$rn}",
                "dom2{$rn}.lft < dom3{$rn}.lft AND dom2{$rn}.rgt > dom3{$rn}.rgt", 'left'
            ) //Ver lo de los orden izq y der (Estandarizar o agregar a la tabla dat_configfuentedato).
                ->join(
                    "{$objConfComp['extensiontabladominio']} dom1{$rn}",
                    "dom1{$rn}.{$objConfComp['campoiddominio']} = dom2{$rn}.{$objConfComp['campoiddominio']} AND COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') = '1'",
                    'left'
                );
        }

        $_queryObject->where(
            "((COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & (niv{$rn}.permisodominio[1] | niv{$rn}.permisodominio[2] | niv{$rn}.permisodominio[3] | niv{$rn}.permisodominio[4]) & (niv{$rn}.revocaraccesodenegado | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][1], '0') | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][2], '0') | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][3], '0') | COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][4], '0'))) |
								 (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & ~COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & (niv{$rn}.permisofueradominio[1] | niv{$rn}.permisofueradominio[2] | niv{$rn}.permisofueradominio[3] | niv{$rn}.permisofueradominio[4]) & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][1], '0') & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][2], '0') & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][3], '0') & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][4], '0'))) |
								 (~COALESCE(dom{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & COALESCE(dom1{$rn}.dominiousuariorol[rol{$rn}.posiciondominiousuariorol], '0') & (niv{$rn}.permisohijosdominio[1] | niv{$rn}.permisohijosdominio[2] | niv{$rn}.permisohijosdominio[3] | niv{$rn}.permisohijosdominio[4]) & (niv{$rn}.revocaraccesodenegado & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][1], '0') & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][2], '0') & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][3], '0') & ~COALESCE(infcomp{$rn}.dominio[dom3{$rn}.posiciondominio][4], '0')))) = '1'"
        );

        return $_queryObject;
    }

}
