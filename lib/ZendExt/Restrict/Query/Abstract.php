<?php

/**
 * Clase abstracta utilizada para compartimentar informacion, agregando a las consultas los filtros correspondientes.
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage Restrict
 * @category   Framework.
 * @uses       ZendExt_Restrict_Query_Config, ZendExt_Restict_Query_Abstract, ZendExt_Query_SQL.
 * @copyright  UCID
 * @version    1.0-0
 */
abstract class ZendExt_Restrict_Query_Abstract
{

    /**
     * Restringe una colsulta de acuerdo a la configuracion de la compartimentacion.
     *
     * @param mixed                         $queryObject       - Objeto consulta.
     * @param ZendExt_Restrict_Query_Config $restrictionConfig - Configuracion de la compartimentacion.
     */
    //public abstract function restrict($_queryObject, ZendExt_Restrict_Query_Config $_restrictionConfig, $idUser);

    /**
     * Devuelve el resto de los elementos de la configuracion de la compartimentacion.
     *
     * @param $_restrictionConfig - Configuracion inicial de la compartimentacion.
     *
     * @return array - Listado de elementos de configuracion de la compartimentacion.
     */
    protected function _getRestrictConfig(ZendExt_Restrict_Query_Config $_restrictionConfig)
    {
        //Obteniendo los datos de la configuracion inicial de la compartimentacion.
        $idUsuario = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;
        $infSource = $_restrictionConfig->informationSource->uri;
        $idElementRestType = $_restrictionConfig->restrictionType->id;
        $restType = $_restrictionConfig->restrictionType->uri;

        $arrayDomType = array();
        $arrayDomId = array();
        $domType = '';
        $filterDom = '';
        foreach ($_restrictionConfig->domain->id as $domT => $idD) {
            array_push($arrayDomType, $domT);
            array_push($arrayDomId, $idD);
        }
        if (count($arrayDomType)) {
            $domType = implode("','", $arrayDomType);
        }

        //Obteniendo configuracion de la compartimentacion.
        $querySQL = ZendExt_Query_SQL::create();
        $querySQL->select("fdom.fuente as tablafuentedominio")
            ->from("mod_compartimentacion.dat_fuentedominio fdom")
            ->addSelect("confinf.campo as campoidfuente")
            ->innerJoin(
                "mod_compartimentacion.dat_fuentedato fdatinf ON (fdom.idfuenteinformacion = fdatinf.idfuentedato AND fdatinf.uri = ?)",
                $infSource
            )
            ->innerJoin(
                "mod_compartimentacion.dat_configfuentedato confinf ON (fdatinf.idfuentedato = confinf.idfuentedato AND confinf.pk = 1)"
            );

        if ($domType) {
            $querySQL->addSelect(
                "fdatdom.fuente as tabladominio, confdom.campo as campoiddominio, fdatdom.uri, fdom.idtipodominio, confdomarbol.padre, confdomlft.campo as lft, confdomrgt.campo as rgt"
            )
                ->innerJoin(
                    "mod_compartimentacion.dat_fuentedato fdatdom ON (fdom.idtipodominio = fdatdom.idfuentedato AND fdatdom.uri IN ('$domType'))"
                )
                ->innerJoin(
                    "mod_compartimentacion.dat_configfuentedato confdom ON (fdatdom.idfuentedato = confdom.idfuentedato AND confdom.pk = 1)"
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_configfuentedato confdomarbol ON (fdatdom.idfuentedato = confdomarbol.idfuentedato AND confdomarbol.padre = 1)"
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_configfuentedato confdomlft ON (fdatdom.idfuentedato = confdomlft.idfuentedato AND confdomlft.identificador = 'lft')"
                )
                ->leftJoin(
                    "mod_compartimentacion.dat_configfuentedato confdomrgt ON (fdatdom.idfuentedato = confdomrgt.idfuentedato AND confdomrgt.identificador = 'rgt')"
                );
        }

        $objConfComp = $querySQL->fetchAll();

        $querySQL = ZendExt_Query_SQL::create();
        $objConfCompType = $querySQL->select(
            "fdatcmp.fuente as tablatipocomp, confcmp.campo as campoidtipocomp, fdatcmp.idfuentedato as idtipocriteriocomp"
        )
            ->from("mod_compartimentacion.dat_fuentedato fdatcmp")
            ->innerJoin(
                "mod_compartimentacion.dat_configfuentedato confcmp ON (fdatcmp.uri = ? AND fdatcmp.idfuentedato = confcmp.idfuentedato AND confcmp.pk = 1)",
                $restType
            )
            ->fetchAll();

        $tempObjConfComp = $objConfComp[0];
        if ($domType) {
            foreach ($objConfComp as $elConfComp) {
                if (!is_array($tempObjConfComp['tabladominio'])) {
                    $tempObjConfComp['tabladominio'] = array();
                    $tempObjConfComp['campoiddominio'] = array();
                    $tempObjConfComp['idtipodominio'] = array();
                    $tempObjConfComp['lft'] = array();
                    $tempObjConfComp['rgt'] = array();
                }
                $tempObjConfComp['tabladominio'][$elConfComp['uri']] = $elConfComp['tabladominio'];
                $tempObjConfComp['campoiddominio'][$elConfComp['uri']] = $elConfComp['campoiddominio'];
                $tempObjConfComp['idtipodominio'][$elConfComp['uri']] = $elConfComp['idtipodominio'];
                $tempObjConfComp['lft'][$elConfComp['uri']] = ($elConfComp['lft']) ? $elConfComp['lft'] : 'lft';
                $tempObjConfComp['rgt'][$elConfComp['uri']] = ($elConfComp['rgt']) ? $elConfComp['rgt'] : 'rgt';
                unset($tempObjConfComp['uri']);
            }
        }

        return array_merge($tempObjConfComp, $objConfCompType[0]);
    }

}
