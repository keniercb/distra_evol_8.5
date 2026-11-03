<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 4/27/2015
 * Time: 9:01 AM
 */
class ProxyReportModel extends ReporteManagerModel
{

    public function getParams($params)
    {
        $header = new Java('java.util.HashMap');
        //$pth = "http://" . $_SERVER["HTTP_HOST"] . $_SERVER["PHP_SELF"];
        //print_r($pth);die;
//        $header->put('REPORTS_DIR',$this->getUrlImg());

        $header->put('poseedorlegal', $params->poseedorlegal);
        $header->put('moneda', $params->moneda);
        $header->put('direccion', $params->direccion);
        $header->put('municipio', $params->municipio);
        $header->put('provincia', $params->provincia);
        $header->put('fechaactual', $params->fechaactual);

        $header->put('REPORT_LOCALE', new Java('java.util.Locale', 'es', 'VE'));
        return $header;
    }

    public function getQueryReporteModeloTramite($params)
    {

        $sqlMatricula = "select
drt.nromatricula,
(select (dmt.nromatricula)
from mod_logactivofijotangible.dat_movregnumericoactivotransp dmt  where dmt.nrocirculacion = drt.nrocirculacion
ORDER by  dmt.idmovregnumerico asc limit 1)as numeromatriculavieja
from mod_logactivofijotangible.dat_regnumericoactivotransp drt
where drt.idregnumerico = " . $params->idregnumerico;

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->execute($sqlMatricula)->fetchAll(PDO::FETCH_ASSOC);

        $matriculaVieja = $datos[0]['numeromatriculavieja'];

        $consulta = "
        SELECT DISTINCT

         rna.idregnumerico,
         rna.annofabricacion as annofabricacion,
         rn.nroserie as nroserie,
         tr.nromatricula as nromatricula,
         tr.nromotor1 as nromotor1,
         '$matriculaVieja' as matriculavieja,
         tr.nromotor2 as nromotor2,
         color.denominacion as colorptim,
         colorsec.denominacion as colorsec,
         tcom.denominacion as combustible,
         ind.codigo as codigo,
         ind.denominacion as denominacion,
         nm.denominacion as marca,
         nmod.denominacion as modelo,
         estatus.denominacion as denomestado ,
         pais.nombrepais as nacionalidad,
         regv.registro,
         regv.numerolaser1,
         regv.numerolaser2,
         regv.tonelage,
         regv.foliocirculacion,
         tipo.denominacion as denomtipotramite,
         sector.denominacion as denomsector, inspector.nombre as nombreinspector


          FROM mod_logactivofijotangible.dat_regnumericoactivo rna

                      inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                      inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                      inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idprod
                      inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ind.idindicador
                      inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nih.idmarca
                      inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nih.idmodelo
                      left join mod_logactivofijotangible.nom_estatustecnico estatus
                      on estatus.idestatustecnico = rna.idestatustecnico
                      left join mod_logactivofijotangible.dat_regnumericoactivotransp tr
                      on tr.idregnumerico = rna.idregnumerico
                      left join mod_logactivofijotangible.nom_tipocombustible tcom
                      on tcom.idtipocombustible = tr.idtipocombustible
                      left join mod_logactivofijotangible.nom_color color on color.idcolor = rna.idcolorprim
                      left join mod_logactivofijotangible.nom_color colorsec on colorsec.idcolor = rna.idcolorsec
                      inner join mod_logactivofijotangible.dat_registrovehiculo regv
                      on regv.idregnumerico = rna.idregnumerico
                      left join mod_nomencladores.nom_pais pais on pais.idpais = ind.idpais
                      left join mod_logactivofijotangible.nom_tipotramite tipo on regv.idtipotramite = tipo.idtipotramite
                       left join mod_logactivofijotangible.nom_sector sector on sector.idsector = regv.idsector
                       left join mod_logactivofijotangible.dat_inspectormatricula inspector
                       on inspector.idinspectormatricula = regv.idinspectormatricula

             WHERE   rna.idregnumerico =
        " . $params->idregnumerico;


        return $consulta;
    }

    public function getQueryReporteLicenciaCirculacion($params)
    {


        $fechaactual = date("d/m/Y");


        $consulta = "
        SELECT DISTINCT

         rna.idregnumerico,
         rna.annofabricacion as annofabricacion,
         rn.nroserie as nroserie,
         tr.nromatricula as nromatricula,
         tr.nromotor1 as nromotor1,
         tr.nrocirculacion as nrocirculacion,
         tr.nromotor2 as nromotor2,
         '$fechaactual' as fechaactual,
         color.denominacion as colorptim,
         colorsec.denominacion as colorsec,
         tcom.denominacion as combustible,
         ind.codigo as codigo,
         ind.denominacion as denominacion,
         nm.denominacion as marca,
         nmod.denominacion as modelo,
         estatus.denominacion as denomestado ,
         pais.nombrepais as nacionalidad,
         regv.registro,
         regv.tipo,
         regv.numerolaser1,
         regv.numerolaser2,
         regv.tonelage,
         regv.foliocirculacion,
         tipo.denominacion as denomtipotramite,
         sector.denominacion as denomsector, inspector.nombre as nombreinspector


          FROM mod_logactivofijotangible.dat_regnumericoactivo rna

                      inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                      inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                      inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idprod
                      inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ind.idindicador
                      inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nih.idmarca
                      inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nih.idmodelo
                      left join mod_logactivofijotangible.nom_estatustecnico estatus
                      on estatus.idestatustecnico = rna.idestatustecnico
                      left join mod_logactivofijotangible.dat_regnumericoactivotransp tr
                      on tr.idregnumerico = rna.idregnumerico
                      left join mod_logactivofijotangible.nom_tipocombustible tcom
                      on tcom.idtipocombustible = tr.idtipocombustible
                      left join mod_logactivofijotangible.nom_color color on color.idcolor = rna.idcolorprim
                      left join mod_logactivofijotangible.nom_color colorsec on colorsec.idcolor = rna.idcolorsec
                      inner join mod_logactivofijotangible.dat_registrovehiculo regv
                      on regv.idregnumerico = rna.idregnumerico
                      left join mod_nomencladores.nom_pais pais on pais.idpais = ind.idpais
                      left join mod_logactivofijotangible.nom_tipotramite tipo on regv.idtipotramite = tipo.idtipotramite
                       left join mod_logactivofijotangible.nom_sector sector on sector.idsector = regv.idsector
                       left join mod_logactivofijotangible.dat_inspectormatricula inspector
                       on inspector.idinspectormatricula = regv.idinspectormatricula

             WHERE   regv.registro = 1 and rna.idregnumerico =
        " . $params->idregnumerico;
        return $consulta;
    }

    public function getQueryReporteComprobanteExistencia($params)
    {
        $consulta = "
        SELECT DISTINCT
                    rna.idregnumerico,
                    rn.nroserie as nroserie,
                    tr.nromatricula as nromatricula,
                    tr.nromotor1 as nromotor1,
                    ind.denominacion as denominacion,
                    nm.denominacion as marca,
                    nmod.denominacion as modelo

                     FROM mod_logactivofijotangible.dat_regnumericoactivo rna

                      inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                      inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                      inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idprod
                      inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ind.idindicador
                      inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nih.idmarca
                      inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nih.idmodelo
                      left join mod_logactivofijotangible.dat_regnumericoactivotransp tr on tr.idregnumerico = rna.idregnumerico

             WHERE   rna.idregnumerico =
        " . $params->idregnumerico;
        return $consulta;
    }

    public function getQueryReporteListadoMatricula($params)
    {
        $idarea = $params->idarea;
        $tipo = $params->permisoacciones;
        $consulta = "
        SELECT DISTINCT
                    rna.idregnumerico,
                    rna.annofabricacion as annofabricacion,
                    rn.nroserie as nroserie,
                    tr.nromatricula as nromatricula,
                    tr.nromotor1 as nromotor1,
                    tr.nromotor2 as nromotor2,
                    color.denominacion as colorptim,
                    colorsec.denominacion as colorsec,
                    tcom.denominacion as combustible,
                    ind.codigo as codigo,
                    ind.denominacion as denominacion,
                    nm.denominacion as marca,
                    nmod.denominacion as modelo,
                    pais.nombrepais as nacionalidad,
                    estatus.denominacion as denomestado ,
                    regv.numerolaser1,regv.numerolaser2,regv.tonelage,regv.foliocirculacion

                     FROM mod_logactivofijotangible.dat_regnumericoactivo rna

                      inner join mod_logactivofijotangible.dat_registronumerico rn on rna.idregnumerico = rn.idregnumerico
                      left join mod_logactivofijotangible.nom_estatustecnico estatus
                      on estatus.idestatustecnico = rna.idestatustecnico
                      inner join mod_logistica.dat_producto pro on pro.idproducto = rn.idproducto
                      inner join mod_logistica.dat_movimiento dm on dm.idproducto = pro.idproducto
                      inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                      INNER JOIN mod_estructuracomp.nom_filaestruc f ON pro.idestructuraop = f.idfila
                      inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = pro.idprod
                      left join mod_nomencladores.nom_pais pais on pais.idpais = ind.idpais
                      inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ind.idindicador
                      inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nih.idmarca
                      inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nih.idmodelo
                      left join mod_logactivofijotangible.dat_regnumericoactivotransp tr
                      on tr.idregnumerico = rna.idregnumerico
                      left join mod_logactivofijotangible.nom_tipocombustible tcom
                      on tcom.idtipocombustible = tr.idtipocombustible
                      left join mod_logactivofijotangible.nom_color color on color.idcolor = rna.idcolorprim
                      left join mod_logactivofijotangible.nom_color colorsec on colorsec.idcolor = rna.idcolorsec inner join mod_logactivofijotangible.dat_registrovehiculo regv
                        on regv.idregnumerico = rna.idregnumerico
                       left join mod_logactivofijotangible.nom_tipotramite tipo on regv.idtipotramite = tipo.idtipotramite
                       left join mod_logactivofijotangible.nom_color colorchapa on colorchapa.idcolor = regv.idcolorchapa
                       left join mod_logactivofijotangible.nom_tipochapa tipochapa on tipochapa.idtipochapa = regv.idtipochapa
                       left join mod_logactivofijotangible.nom_sector sector on sector.idsector = regv.idsector
                       left join mod_persona.dat_persona persona on persona.idpersona = regv.idpersona
                       left join mod_logactivofijotangible.dat_inspectormatricula inspector on inspector.idinspectormatricula = regv.idinspectormatricula
             WHERE dd.estado = 3 AND f.idfila IN (
                                        SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                                            WHERE
                                            lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc
                                            WHERE idfila = " . $idarea . ") AND
                                            rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc
                                            WHERE idfila = " . $idarea . ")
                                        )    and regv.tipo = " . $tipo . "
        ";

        /* $conn = Zend_Registry::get('conexion');
          $datos = $conn->execute($consulta)->fetchAll(PDO::FETCH_ASSOC);
          print_r(count($datos));die; */
        return $consulta;
    }

    public function report($datas)
    {

        $this->initParent($this, $datas);
    }

}
