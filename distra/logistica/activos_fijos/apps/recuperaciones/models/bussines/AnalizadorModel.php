<?php

if (!class_exists('ComunAFTModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class AnalizadorModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->mComunAFT = ComunAFTModel::getInstance();
    }

    public function getDatosPorMedidor($params){
        $idmedidor=$params['idmedidor'];
        $medidorScripts = $this->getMedidores($params);
        $sql = $medidorScripts[$idmedidor]['sql'];
        $sql_total = $medidorScripts[$idmedidor]['sql_total'];
        $conn = Zend_Registry::get('conexion');
        if ($sql) {
            $datos = $conn->execute( $sql)
            ->fetchAll(PDO::FETCH_ASSOC);
            $total = $conn->execute( $sql_total)
            ->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datos,
            'total' => $total[0]['cantidad']
        );
        }
        
    }

    public function getDatos($params){
        $medidores = $this->getMedidores($params);
        $resp = [];
        $conn = Zend_Registry::get('conexion');
        
        foreach ($medidores as $key => $value) {
            $datos = $conn->execute($value['sql_total'])->fetchAll(PDO::FETCH_ASSOC);
            $resp[] = array(
                'id' => $value['id'],
                'nombre' => $value['nombre'],
                'cantidad' => $datos[0]['cantidad'] ? $datos[0]['cantidad'] : 0,
                'detalles' => $value['detalles'],
                'problemas' => $value['problemas'],
                'solucion' => $value['solucion']
            );
        }
        return $resp;
    }
    public function getEstructuras() { 
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }

    public function getMedidores($params){
       // $estructuraeobj = $this->global->EstructuraEconomica;
       // $entidad = ($estructuraeobj->idestructuracomun) ? $estructuraeobj->idestructuracomun : $this->global->Estructura->idestructura;
        $entidad = ($params['idestructura']) ? $params['idestructura'] : $this->global->Estructura->idestructura;
        $params['entidad'] = $entidad;
        $sinNat = $this->getSinNaturaleza($params);
        $singrupo = $this->getSinGrupo($params);
        $sinresp = $this->getSinResponsable($params);
        $sindoc = $this->getSinDocumento($params);
        $sinarea = $this->getSinAreaEliminada($params);
        $sinexplo =  $this->getSinExplotacionMarcado($params);
        $tasacero = $this->getTazaCero($params);
        $utilesdepreciacion = $this->getUtilesConDepreciacion($params);
        $sinconfi = $this->getSinConfigurado($params);
        $campoisuh = $this->getCampoIsuh($params);
        $estadoinc = $this->getEstadoIncorrecto($params);
        $traslado = $this->getTrasladoSeis($params);
        $mayormenor =  $this->getMayorMenor($params);
        $invrepetido =  $this->getInventarioRepetido($params);
        $areassincentrocosto = $this->getAreasinCentrocosto($params);
        $activosnodepreciados = $this->getActivosNoDepreciados($params);



        return array(
            0 => array(
                "id" => 0, 
                "nombre" => "MEDIOS SIN NATURALEZA | MEDIOS CON NATURALEZAS SIN CONFIGURAR",
                "detalles" => "Se muestran los medios que no tienen una naturaleza asociada o que la naturaleza no la tienen configurada en los datos por naturaleza.",
                "problemas" => "<ul><li>Al realizar una entrada (alta/compra/etc) ya sea de activos o útiles no aparezcan algunas columnas.</li></ul>",
                "solucion" => "Asociarle una naturaleza al indicador al cual pertenece el medio y configurar los datos por naturaleza del mismo.",
                "sql" => $sinNat['sql'],
                "sql_total" => $sinNat['sql_total']
            ),
            // 1 => array(
            //     "id" => 1,
            //     "nombre" => "MEDIOS SIN GRUPO | MEDIOS CON GRUPOS SIN CONFIGURAR",
            //     "detalles" => "Se muestran los medios que no tienen asociado un grupo, o el grupo al cual están asociados no tienen cuenta configurada en los grupos por cuentas.",
            //     "problemas" => " <ul><li>Causa descuadres con la contabilidad, imposibilitando el cierre contable del mes</li></ul>",
            //     "solucion" => "Asociarle una naturaleza al indicador al cual pertenece el medio y configurar los datos por naturaleza del mismo.",
            //     "sql" =>  $singrupo['sql'],
            //     "sql_total" => $singrupo['sql_total']
            // ),
            2 => array(
                 "id" => 2,
                "nombre" => "MEDIOS SIN RESPONSABLE DIRECTO",
                "detalles" => "Se muestran los medios que no tienen asociado un responsable directamente.",
                "problemas" => "<ul><li>No aparecen en las recuperaciones de medios por responsable</li></ul> ",
                "solucion" => "Realizar operaciones de modificación a estos medios para asignarle un responsable.<br>
                               Algunas de las operaciones que permiten realizar la modificación del responsable son:
                               <ol>
                                <li>• Cambio de responsable masivo</li>
                                <li>• Modificación de propiedad</li>
                                <li>• Traslado interno o entre áreas</li>
                                </ol>
                            ",
                "sql" =>  $sinresp['sql'],
                "sql_total" => $sinresp['sql_total']
            ),
            3 => array(
               "id" => 3,
               "nombre" => "MEDIOS EN ÁREAS ELIMINADAS",
               "detalles" => "Se muestran los medios que se encuentran en áreas o estructuras que han sido eliminadas.",
               "problemas" => " <ol>
                                <li>• Ocasiona que los medios no aparezcan en muchas de las recuperaciones.</li>
                                <li>• Ocasiona que los medios no se puedan seleccionar para poder realizarles movimientos.</li>
                                </ol>",
               "solucion" => "Contactar con el administrador del sistema para restaurar el área o estructura eliminada.",
               "sql" =>  $sinarea['sql'],
               "sql_total" => $sinarea['sql_total']
            ),
            4 => array(
                "id" => 4,
                "nombre" => "MEDIOS SIN EL CAMPO EXPLOTACIÓN SELECCIONADO",
                "detalles" => "Se muestran los medios en explotación, ya sean AFT o UH con el campo 'explotación' del indicador sin marcar.",
                "problemas" => "<ol>
                                <li>• Ocasiona que los medios no aparezcan en muchas de las recuperaciones.</li>
                                <li>• Ocasiona que los medios no se puedan seleccionar para poder realizarles movimientos.</li>
                                </ol>",
                "solucion" => "En el maestro de productos y servicios, buscar el indicador(es) a los que pertenecen los activos y modificarlo marcándole el campo 'explotación'",
                "sql" =>  $sinexplo['sql'],
                "sql_total" => $sinexplo['sql_total']
            ),
            5 => array(
                "id" => 5,
                "nombre" => "ACTIVOS CON TASA FISCAL IGUAL A 0",
                "detalles" => "Se muestran los activos fijos, con la tasa fiscal en 0.",
                "problemas" => "<ol>
                                <li>• Ocasiona que los medios no deprecien como es debido.</li>
                                <li>• Agrega a los medios que todavía tienen valor residual en el documento de depreciación pero con depreciación igual 0.</li>
                                </ol>",
                "solucion" => "Realizando una modificación de propiedad de estos medios y actualizándole la tasa fiscal.",
                "sql" =>  $tasacero['sql'],
                "sql_total" => $tasacero['sql_total']
            ),
            6 => array(
                "id" => 6,
                "nombre" => "ÚTILES CON CUENTA DE DEPRECIACIÓN | ACTIVOS QUE MARCADOS COMO UH",
                "detalles" => "Son UH que tienen cuenta de depreciación configurada, o activos con cuenta de depreciación configurada que tienen marcado el campo 'es uh' en el nomenclador de indicadores.",
                "problemas" => "<ol>
                                <li>• Si son activos, estos no aparecerán en los reportes destinados para activos fijos</li>
                                <li>• Si son activos, estos no podrán ser seleccionados para realizar movimientos.</li>
                                <li>• Si son útiles, no hay graves consecuencias, sin embargo no debería tener esta cuenta configurada, es una mala práctica.</li>
                                </ol>",
                "solucion" => "Si es un activo, se le debe desmarcar el campo 'es uh' en el indicador al que pertenece. Si es un UH se le debe quitar la cuenta asociada al grupo en la configuración.",
                "sql" =>  $utilesdepreciacion['sql'],
                "sql_total" => $utilesdepreciacion['sql_total']    
            ),
            7 => array(
                "id" => 7,
                "nombre" => "GRUPOS DE ACTIVOS SIN CUENTAS CONFIGURADAS",
                "detalles" => "Son los grupos que pertenecen a activos fijos (porque tienen marcado 'en explotación' y no tienen marcado 'es uh' en el indicador) sin las cuentas de activo o de depreciación configuradas.",
                "problemas" => "<ul><li>Puede traer descuadres en el balance contable.</li></ul>",
                "solucion" => "Configurar las cuentas por grupos en la entidad",
                "sql" =>  $sinconfi['sql'],
                "sql_total" => $sinconfi['sql_total']
            ),
            8 => array(
                "id" => 8,
                "nombre" => "ÚTILES CON CAMPO ES ÚTIL SIN MARCAR",
                "detalles" => "Son los medios considerados como UH (porque la cuenta del grupo es la 187.xxx) y que no tienen marcado el campo 'es uh' en el indicador al que pertenecen.",
                "problemas" => "<ol>
                                <li>• Que aparezcan útiles en los listados de activos.</li>
                                <li>• Que no aparezcan los útiles en los listados de útiles y herramientas.</li>
                                <li>• Que no aparezcan los útiles para ser escogidos en los movimientos.</li>
                                </ol>",
                "solucion" => "Modificar el campo 'es uh' al indicador al que pertenecen los útiles en cuestión.",
                "sql" =>  $campoisuh['sql'],
                "sql_total" => $campoisuh['sql_total']
            ),
            9 => array(
                "id" => 9,
                "nombre" => "MEDIOS SIN DOCUMENTOS",
                "detalles" => "Medios sin historial de movimientos.",
                "problemas" => "<ul><li>Pueden ser eliminados de la BD en cualquier momento.</li></ul>",
                "solucion" => "Contactar con el administrador.",
                "sql" =>  $sindoc['sql'],
                "sql_total" => $sindoc['sql_total']
            ),
            10 => array(
                "id" => 10,
                "nombre" => "MEDIOS DE BAJA CON ESTADO DE OPERACIÓN INCORRECTO",
                "detalles" => "Son medios que en el sistema están dados de baja pero tienen un estado de operación diferente al de BAJA.",
                "problemas" => "<ol>
                                <li>• Comportamiento inesperado en la aplicación.</li>
                                <li>• Que salgan los medios en listados donde no deberían salir.</li>
                                </ol>",
                "solucion" => "Contactar con el administrador.",
                "sql" =>  $estadoinc['sql'],
                "sql_total" => $estadoinc['sql_total']
            ),
            11 => array(
                "id" => 11,
                "nombre" => "MEDIOS TRASLADADOS CON INCONSISTENCIA",
                "detalles" => "Son medios que en el sistema están trasladados pero la entidad y el área que tienen asociados no valida este estado de TRASLADADO del medio.",
                "problemas" => "<ol>
                                <li>• Comportamiento inesperado en la aplicación.</li>
                                <li>• Que salgan los medios en listados donde no deberían salir.</b></li>
                                </ol>",
                "solucion" => "Contactar con el administrador.",
                "sql" =>  $traslado['sql'],
                "sql_total" => $traslado['sql_total']
            ),
            12 => array(
                "id" => 12,
                "nombre" => "MEDIOS CON ÁREA DISTINTA AL ÁREA DEL PRODUCTO ASOCIADO",
                "detalles" => "Son medios con el idarea <> idestructura.",
                "problemas" => "Comportamiento inesperado en la aplicación.<br>",
                "solucion" => "Contactar con el administrador.",
                "sql" =>  $mayormenor['sql'],
                "sql_total" => $mayormenor['sql_total']
            ),
            13 => array(
                "id" => 13,
                "nombre" => "ACTIVOS CON NÚMEROS DE INVENTARIO REPETIDOS",
                "detalles" => "Son activos con número de inventario repetido.",
                "problemas" => "Errores al crear movimientos.<br>",
                "solucion" => "Hacer una modificación de propiedad para cambiar el número repetido",
                "sql" =>  $invrepetido['sql'],
                "sql_total" => $invrepetido['sql_total']
            ) ,
            14 => array(
                "id" => 14,
                "nombre" => "ÁREAS DE RESPONSABILIDAD SIN CENTRO DE COSTO ASOCIADO",
                "detalles" => "Son áreas de responsabilidad que no están asociadas a ningún centro de costo.",
                "problemas" => "No cargan todas las áreas de responsabilidad necesarias en la entidad.<br>",
                "solucion" => "Asociar las áreas de responsabilidad a un centro de costo.",
                "sql" =>  $areassincentrocosto['sql'],
                "sql_total" => $areassincentrocosto['sql_total']
            ),
            15 => array(
                "id" => 15,
                "nombre" => "ACTIVOS QUE DEBERÍAN ESTAR DEPRECIANDO Y NO LO ESTÁN",
                "detalles" => "Son activos que no están depreciando.",
                "problemas" => "Activos paralizados o error inesperado en el sistema.<br>",
                "solucion" => "Contactar con el administrador.",
                "sql" =>  $activosnodepreciados['sql'],
                "sql_total" => $activosnodepreciados['sql_total']
            ),
        );
    }
    public function filtro($params,$sql){
      $conn = Zend_Registry::get('conexion');
        if($params['criterio']){
            if($params['idmedidor']!= 14){
                $sql .= " AND ( 
                    query.codigo ILIKE '%{$params['criterio']}%' 
                    OR query.denominacion ILIKE '%{$params['criterio']}%' 
                ) ";
            } else {
                $sql .= " AND (                 
                    query.area ILIKE '%{$params['criterio']}%'
                    OR query.estructura ILIKE '%{$params['criterio']}%' 
                ) ";
            }
        } 
        if($params['codigo']){
            $sql .= " AND ( query.codigo ILIKE '%{$params['codigo']}%') ";
        }
        if($params['estructura']){
            $sql .= " AND ( query.estructura  ILIKE '%{$params['estructura']}%' ) ";
        }
        if($params['denominacion']){
            $sql .= " AND  query.denominacion ILIKE '%{$params['denominacion']}%' ";
        }
        if($params['naturaleza']){

            $sql .= " AND  query.idnaturaleza = {$params['naturaleza']} ";
        }
        if($params['nroinventario']){
            $sql .= " AND  query.nroinventario ILIKE '%{$params['nroinventario']}%' ";
        }
        if($params['area']){
            $sql .= " AND ( query.area ILIKE '%{$params['area']}%') ";
        }
        if($params['grupo']){
            $sql .= " AND   query.grupo ILIKE '%{$params['grupo']}%' ";
        }
        if(is_numeric($params['tasafiscal'])){
            $sql .= " AND query.tasafiscal = {$params['tasafiscal']} ";
        }
        if($params['responsable']){
            $sql .= " AND query.idresponsable = {$params['responsable']} ";
        }
        if($params['idestructura'] && $params['idmedidor'] != 3){
            $sql .= " AND query.idestructuraop in ({$params['idestructura']}) ";
        }
        if ($params['comparaciones']){
            foreach ($params['comparaciones'] as $key => $value) {
                if($value['campo'] == 'tasafiscal' ){
                  $sql .= " AND    query.tasafiscal {$value['signo']} {$value['valor']} ";
                }
            }
        }
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
       $sql_total = "SELECT COUNT(sub.*) AS cantidad FROM ($sql) sub ";
        $sql .= "limit $limit";
        $sql .= " offset $start";
     /* if($params['limit'] && $params['start'] >= 0 ){
           $sql .= " limit {$params['limit']} offset {$params['start']}
            "; 
        }*/
         return array(
            'sql' => $sql,
            "sql_total" => $sql_total
        );
    }

    public function getSinNaturaleza($params){
        $sql = "
           select * from ( SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza ,
                n.idnaturaleza ,
                resp.idresponsable
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
            LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
            LEFT JOIN mod_logactivofijotangible.conf_tipomedio cfgtm on cfgtm.idtipomedio = n.idnaturaleza
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
            LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0
            
            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
            LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
            
            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
            
            WHERE   n.idnaturaleza is null and  eop.idestructuraop in ({$params['entidad']}) OR
                n.denominacion ILIKE 'NINGUNA' and   eop.idestructuraop in ({$params['entidad']})
                OR cfgtm.idtipomedio IS NULL and   eop.idestructuraop in ({$params['entidad']})) query where true 
        ";
 
  

        return $this->filtro($params,$sql);
    }
    public function getSinGrupo($params){

        $sql = "
        select * from ( SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                  eop.idestructuraop,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza  
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
            LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
            LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
            
            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
            LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
            LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        
        WHERE 
            eop.idestructuraop in ({$params['entidad']}) and
            g.idgruposubgrupo is null
            OR gc.idgrupocuenta IS NULL and  eop.idestructuraop in ({$params['entidad']})) query where true
        
        ";


        
        return $this->filtro($params,$sql);
    }
    public function getSinResponsable($params){
        //$start = ($params['start']) ? $params['start'] : 0;
        //$limit = ($params['limit']) ? $params['limit'] : 30;
        $sql = "
        select * from (  SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion, 
                eop.idestructuraop,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza,
                n.idnaturaleza,
                resp.idresponsable
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
            INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
            LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
            LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
            
            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
            LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
            LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
            WHERE
            eop.idestructuraop in ({$params['entidad']}) and rna.idresponsable is null and rna.esbaja = 0 and rna.estaentidad = 1) query where true
            ";
            return $this->filtro($params,$sql);        
        }

    public function getSinDocumento($params){
        $sql = "
       select * from ( SELECT
            DISTINCT
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion,
            rna.nroinventario,
            eop.idestructuraop,
            COALESCE(e.denominacion, eop.denominacion) as estructura,
            COALESCE(ea.denominacion, eopa.denominacion) as area,
            (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
            g.denominacion as grupo,
            rna.tasafiscal,
            n.denominacion as naturaleza,
            n.idnaturaleza,
            resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        LEFT JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
        
        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        WHERE  eop.idestructuraop in ({$params['entidad']}) and mrn.idmovregnumerico is null AND rna.idestadoperacion > 0
        ) query where true
        ";
        return $this->filtro($params,$sql);
    
    }
    public function getSinAreaEliminada($params){
        $sql = "
        select * from (  SELECT
            DISTINCT
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion,
            rna.nroinventario,
            COALESCE(e.denominacion, eop.denominacion) as estructura,
            eop.idestructuraop,
            COALESCE(ea.denominacion, eop.denominacion) as area,
            (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
            g.denominacion as grupo,
            rna.tasafiscal,
            n.denominacion as naturaleza,
            n.idnaturaleza,
            resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        
        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
        
        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        where  eop.idestructuraop in ({$params['entidad']}) and nf.fechafin is not null or nfa.fechafin is not null
        ) query where true
        ";
        return $this->filtro($params,$sql);
    }
    public function getSinExplotacionMarcado($params){
        $sql = "
        select * from ( SELECT
            DISTINCT
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion,
            rna.nroinventario,
            COALESCE(e.denominacion, eop.denominacion) as estructura,
            eop.idestructuraop,
            COALESCE(ea.denominacion, eopa.denominacion) as area,
            (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
            g.denominacion as grupo,
            rna.tasafiscal,
            n.denominacion as naturaleza,
            n.idnaturaleza,
            resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0
        
        
        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
        
        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        WHERE  eop.idestructuraop in ({$params['entidad']}) and ih.explotacion <> 1) query where true
   
        ";
        return $this->filtro($params,$sql);
    }
    public function getTazaCero($params){
        $sql = "
        select * from (  SELECT
            DISTINCT
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion,
            rna.nroinventario,
            COALESCE(e.denominacion, eop.denominacion) as estructura,
            eop.idestructuraop,
            COALESCE(ea.denominacion, eopa.denominacion) as area,
            (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
            g.denominacion as grupo,
            rna.tasafiscal,
            n.denominacion as naturaleza,
            n.idnaturaleza,
            resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador

        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        WHERE 
         eop.idestructuraop in ({$params['entidad']}) and
        (rna.tasafiscal = 0 OR rna.tasafiscal is NULL)
        and ih.isuh <> 1 
        and rna.idestadoperacion NOT IN (0,7)
        ) query where true
        ";
        return $this->filtro($params,$sql); 
    }
    public function getUtilesConDepreciacion($params){
        $sql = "
        select *
        from (
                    with w_utiles as (select rna.idregnumerico as idregistro_util, rna.tasafiscal, p.idestructura, p.idestructuracomun, 
                                rna.idresponsable, i.idnaturaleza, i.numeropieza, i.codigo, i.denominacion, g.denominacion as grupo,
                                rna.nroinventario
                            from mod_logactivofijotangible.dat_registronumerico rn
                            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                            inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                            inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
                            left join mod_datosmaestros.nom_gruposubgrupo g on (g.idgruposubgrupo = ih.idgruposubgrupo)
                            left join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun)
                            left join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
                            where nc.concatcta like '187.%' and cgc.idcuentadepreciacion is not null
                        )
        (select distinct 'UTILES CON CUENTA DE DEPRECIACION' as agrupador,
                coalesce(utiles.numeropieza, utiles.codigo) as codigo,
                utiles.denominacion,
                utiles.numeropieza,
                coalesce(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                coalesce(ea.denominacion, eopa.denominacion) as area,                
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                utiles.denominacion as grupo,
                utiles.tasafiscal,
                n.denominacion as naturaleza,
                utiles.nroinventario
        from w_utiles as utiles 
        inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = utiles.idestructuracomun
        left join mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0

        inner join mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = utiles.idestructura
        left join mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        left join mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = utiles.idresponsable
        left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        left join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = utiles.idnaturaleza
        where  eop.idestructuraop in ({$params['entidad']}) 
        )

        union

        (with w_activos as (select rna.idregnumerico as idregistro_activo, rna.tasafiscal, p.idestructura, p.idestructuracomun,
                                rna.idresponsable, i.idnaturaleza, i.numeropieza, i.codigo, i.denominacion, g.denominacion as grupo,
                                rna.nroinventario
                            from mod_logactivofijotangible.dat_registronumerico rn
                            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                            inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                            inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                            inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
                            left join mod_datosmaestros.nom_gruposubgrupo g on (g.idgruposubgrupo = ih.idgruposubgrupo)
                            left join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun)
                            left join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
                            where nc.concatcta not like '187.%' and (ih.explotacion = 1 and ih.isuh = 1)
                        )
        (select distinct 'ACTIVOS MARCADOS COMO UH' as agrupador,
                coalesce(activos.numeropieza, activos.codigo) as codigo,
                activos.denominacion,
                activos.numeropieza,
                coalesce(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                coalesce(ea.denominacion, eopa.denominacion) as area,                
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                activos.denominacion as grupo,
                activos.tasafiscal,
                n.denominacion as naturaleza,
                activos.nroinventario
        from w_activos as activos 
        inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = activos.idestructuracomun
        left join mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0

        inner join mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = activos.idestructura
        left join mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        left join mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        left join mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = activos.idresponsable
        left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        left join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = activos.idnaturaleza
        where  eop.idestructuraop in ({$params['entidad']}) 
        )
        )) query
        where true
           ";
        return $this->filtro($params,$sql);
    }
    public function getSinConfigurado($params){
        $sql = "
        select * from (   SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza,
                n.idnaturaleza,
                resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas cgc on cgc.idgruposubgrupo = g.idgruposubgrupo    
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        WHERE 
            eop.idestructuraop in ({$params['entidad']}) and
            cgc.idcuentaactivo IS NULL OR
            cgc.idcuentadepreciacion IS NULL
            AND ih.isuh <> 1 and eop.idestructuraop in ({$params['entidad']}) 
            ) query where true
            ";
        return $this->filtro($params,$sql);
    }
    public function getCampoIsuh($params){
        $sql = "
        select * from (  SELECT
            DISTINCT
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion,
            rna.nroinventario,
            COALESCE(e.denominacion, eop.denominacion) as estructura,
            eop.idestructuraop,
            COALESCE(ea.denominacion, eopa.denominacion) as area,
            (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
            g.denominacion as grupo,
            rna.tasafiscal,
            n.denominacion as naturaleza,
            n.idnaturaleza,
            resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas cgc on cgc.idgruposubgrupo = g.idgruposubgrupo
        LEFT JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = cgc.idcuentaactivo
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        WHERE eop.idestructuraop in ({$params['entidad']}) and nc.concatcta like '187.%' and ih.isuh <> 1 and rna.idestadoperacion not in (0,7)
        ) query where true
                ";
        return $this->filtro($params,$sql);
    }
    public function getEstadoIncorrecto($params){
        $sql = "
        select * from (   SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza,
                n.idnaturaleza,
                resp.idresponsable
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
            LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
            LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
            LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
            WHERE eop.idestructuraop in ({$params['entidad']}) and (rna.esbaja = 1 AND rna.idestadoperacion <> 7) OR (rna.idestadoperacion = 7 AND rna.esbaja = 0 and eop.idestructuraop in ({$params['entidad']}) )
            ) query where true
        ";
        return $this->filtro($params,$sql);
    }
    public function getTrasladoSeis($params){
        $sql = "
        select * from (   SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza,
                n.idnaturaleza,
                resp.idresponsable
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
            LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
            LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
            LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
            WHERE eop.idestructuraop in ({$params['entidad']}) and (rna.idestadoperacion <> 6 and p.idestructuracomun = p.idestructura)
                OR (rna.idestadoperacion = 6 and eop.idestructuraop in ({$params['entidad']})  and p.idestructuracomun <> p.idestructura)) query where true
              
        ";
        return $this->filtro($params,$sql);
    }
    public function getMayorMenor($params){
        $sql = "
        select * from (    SELECT
                DISTINCT
                COALESCE(i.numeropieza, i.codigo) as codigo,
                i.denominacion,
                rna.nroinventario,
                COALESCE(e.denominacion, eop.denominacion) as estructura,
                eop.idestructuraop,
                COALESCE(ea.denominacion, eopa.denominacion) as area,
                (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
                g.denominacion as grupo,
                rna.tasafiscal,
                n.denominacion as naturaleza,
                n.idnaturaleza,
                resp.idresponsable
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
            
            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
            
            INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
            LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
            LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0
            
            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
            LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
            LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
            WHERE eop.idestructuraop in ({$params['entidad']}) and  rna.idarearesp <> p.idestructura) query where true
        ";
        
         return $this->filtro($params,$sql);
    }
    public function getInventarioRepetido($params){
        $sql= "  
         select * from (WITH w_inventarios_rep AS (
            SELECT rna.nroinventario, eop.idestructuraop
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna USING (idregnumerico)
            INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ni.idindicador
            INNER JOIN mod_estructuracomp.v_dametodasestructuras est ON est.idestructura = dp.idestructuracomun
            LEFT JOIN mod_estructuracomp.dat_estructuraop eop ON eop.idestructuraop = est.idestructura AND eop.idproyecto = 0
            WHERE nih.explotacion = 1 
              AND est.denominacion NOT ILIKE '%hasta%' 
              AND rna.esbaja <> 1
            GROUP BY rna.nroinventario, eop.idestructuraop
            HAVING COUNT(*) > 1  -- Solo selecciona los que tienen más de una ocurrencia en la misma idestructuraop
        )
        SELECT rna.nroinventario, 
               ni.denominacion AS denominacion, 
               est.denominacion AS estructura, 
               eop.idestructuraop, 
               COALESCE(ni.numeropieza, ni.codigo) AS codigo, 
               COALESCE(ea.denominacion, eopa.denominacion) AS area, 
               n.denominacion AS naturaleza, 
               g.denominacion AS grupo, 
               rna.tasafiscal, 
               (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) AS responsable, 
               n.idnaturaleza, 
               resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna USING (idregnumerico)
        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = rn.idproducto
        INNER JOIN mod_estructuracomp.nom_filaestruc nf ON nf.idfila = dp.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e ON e.idestructura = nf.idfila AND e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop ON eop.idestructuraop = nf.idfila AND eop.idproyecto = 0
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa ON nfa.idfila = dp.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea ON ea.idestructura = nfa.idfila AND ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa ON eopa.idestructuraop = nfa.idfila AND eopa.idproyecto = 0
        INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
        LEFT JOIN mod_datosmaestros.nom_naturaleza n ON n.idnaturaleza = ni.idnaturaleza
        INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ni.idindicador
        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g ON g.idgruposubgrupo = nih.idgruposubgrupo
        INNER JOIN mod_estructuracomp.v_dametodasestructuras est ON est.idestructura = dp.idestructuracomun
        LEFT JOIN mod_logactivofijotangible.dat_responsable resp ON resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona
        INNER JOIN w_inventarios_rep AS w_inv_rep ON (w_inv_rep.nroinventario = rna.nroinventario AND w_inv_rep.idestructuraop = eop.idestructuraop)
        WHERE nih.explotacion = 1 and  eop.idestructuraop in ({$params['entidad']})
          AND est.denominacion NOT ILIKE '%hasta%' 
          AND rna.esbaja <> 1
        ORDER BY rna.nroinventario DESC
         ) query where true
       ";
    //     $sql = "
    //     select 
    //    COALESCE(ni.numeropieza, ni.codigo) as codigo,
    //    rna.nroinventario, ni.denominacion, array_agg(distinct est.denominacion) as entidad, count(rna.nroinventario)
    //    from mod_logactivofijotangible.dat_registronumerico rn
    //    inner join mod_logactivofijotangible.dat_regnumericoactivo rna using(idregnumerico)
    //    inner join mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto
    //    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
    //    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
    //    inner join mod_estructuracomp.v_dametodasestructuras est on est.idestructura = dp.idestructuracomun
    //    where nih.explotacion = 1 and nih.isuh <> 1 and est.denominacion not ilike '%hasta%'
    //    and rna.esbaja <> 1
    //    group by ni.numeropieza, ni.codigo,rna.nroinventario, ni.denominacion--, est.denominacion
    //    HAVING count(rna.nroinventario) > 1
    //     ";
        return $this->filtro($params,$sql);

    }
    public function getAreasinCentrocosto($params){

        $sql= "  select * from (
        select distinct 
        op.denominacion as area,
       est.denominacion as estructura,
       op.idestructuraop,
       '' as codigo,
       '' as numeropieza,
       '' as denominacion
        from mod_estructuracomp.nom_filaestruc f
        inner join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila and op.idproyecto = 0 
        inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idarearesp = op.idestructuraop
        inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = drna.idregnumerico
        inner join mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto 
        inner join mod_estructuracomp.v_dametodasestructuras est on est.idestructura = dp.idestructuracomun
        left join mod_contabilidadcosto.conf_areasreponsabilidad aresp on aresp.idarea = drna.idarearesp 
        where op.idestructuraop in ({$params['entidad']}) and  op.idproyecto = 0 and f.fechafin is null and aresp.idarea is null
        ) query where true ";
        return $this->filtro($params,$sql);

    }

    public function getActivosNoDepreciados($params){
        $sql = "
        select * from (  SELECT
            DISTINCT
            COALESCE(i.numeropieza, i.codigo) as codigo,
            i.denominacion,
            rna.nroinventario,
            COALESCE(e.denominacion, eop.denominacion) as estructura,
            eop.idestructuraop,
            COALESCE(ea.denominacion, eopa.denominacion) as area,
            (pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as responsable,
            g.denominacion as grupo,
            rna.tasafiscal,
            n.denominacion as naturaleza,
            n.idnaturaleza,
            resp.idresponsable
        FROM mod_logactivofijotangible.dat_registronumerico rn
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
        inner join mod_logactivofijotangible.nom_actividad nact on nact.idactividad = rna.idactividad
		inner join mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion 
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador

        INNER JOIN mod_estructuracomp.nom_filaestruc nf on nf.idfila = p.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = nf.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = nf.idfila and eop.idproyecto = 0
        
        INNER JOIN mod_estructuracomp.nom_filaestruc nfa on nfa.idfila = p.idestructura
        LEFT JOIN mod_estructuracomp.dat_estructura ea on ea.idestructura = nfa.idfila and ea.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eopa on eopa.idestructuraop = nfa.idfila and eopa.idproyecto = 0

        LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas gc on gc.idgruposubgrupo = g.idgruposubgrupo
        LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable
        LEFT JOIN mod_persona.dat_persona pers on pers.idpersona = resp.idpersona
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        WHERE 
         eop.idestructuraop in ({$params['entidad']})
        and (rna.valoradquisicion > rna.depreciacionacumulada
         or rna.valorcontable > rna.depreciacionacumulada ) 
        and  ( ndep.iddepreciacion NOT IN (2,3) or (ndep.iddepreciacion = 3 and rna.recursoconsumido = 0 ))
        and ih.isuh <> 1 
        and rna.esbaja = 0
        and rna.idestadoperacion NOT IN (0,7)
        ) query where true
        ";
        return $this->filtro($params,$sql); 
    }
    

}
