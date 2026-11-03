<?php

class DatEstudiomatrizdanalisispoliticoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los datos de un modelo de analisis politicos
     * @param $idproyecto
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return Doctrine_Collection
     */
    public function getProyectoProyectoMap($idproyecto) {
        return DatEstudiomatrizdanalisispolitico::getProyectomap($idproyecto);
    }

    public function saveProyectoProyectoMap($objeto) {
        $objproyectoMap = Doctrine::getTable('DatEstudiomatrizdanalisispolitico')->find($objeto['idestudiomatrizdanalisispolitico']);
        $objproyectoMap->resultado = $objeto['resultado'];
        $objproyectoMap->save();

        return array('idestudiomatrizdanalisispolitico' => $objproyectoMap->idestudiomatrizdanalisispolitico, 'idproyecto' => $objproyectoMap->idproyecto);
    }

    /**
     * @copyright XETID Cuba
     * @name obtenerMatriz
     * @author Ing Grabiel Montero Coello
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @use Función para obtener los datos para crear el grid matriz
     * @return array
     */
    public static function obtenerMatriz($idEstudioMap) {
        try {
            $fuerzas = DatFuerzaModel::obtenerFuerzas(null, null, $idEstudioMap);
            $actos = DatActoModel::obtenerActos(null, null, $idEstudioMap);
            foreach ($fuerzas['root'] as $key => $fuerza) {
                foreach ($actos['root'] as $acto) {
                    $fuerzaacto = DatFuerzaacto::obtenerFuerzaActo($fuerza['idfuerza'], $acto['idacto']);
                    $fuerzas['root'][$key]['i' .   $acto['idacto']] = floatval($fuerzaacto[0]['interes']);
                    $fuerzas['root'][$key]['ci' .  $acto['idacto']] = floatval($fuerzaacto[0]['controlinstitucional']);
                    $fuerzas['root'][$key]['ch' .  $acto['idacto']] = floatval($fuerzaacto[0]['controlhecho']);
                    $fuerzas['root'][$key]['fpp' . $acto['idacto']] = floatval($fuerzaacto[0]['factorpeso']);
                    $fuerzas['root'][$key]['fpi' . $acto['idacto']] = floatval($fuerzaacto[0]['factorinteres']);
                }
            }
            $data = false;
            if (count($fuerzas['root']) && count($actos['root'])) {
                $data = array(
                    'success' => true,
                    'fuerzas' => $fuerzas['root'],
                    'actos' => $actos['root'],
                    'config' => array('colspan' => 5, 'align' => 'left')
                );
            } elseif (count($fuerzas['root'])) {
                $data = array(
                    'success' => false,
                    'codmsg' => 3,
                    'message' => "noActsMessage",
                );
            } elseif (count($actos['root'])) {
                $data = array(
                    'success' => false,
                    'codmsg' => 3,
                    'message' => "noForcesMessage",
                );
            } else {
                $data = array(
                    'success' => false,
                    'codmsg' => 3,
                    'message' => "noForcesActsMessage",
                );
            }
            return $data;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * @copyright XETID Cuba
     * @name gestionarActo
     * @author Ing Grabiel Montero Coello
     * @param $accion : Acción a ejecutar sobre los datos
     * @param $acto : Objeto con los datos a procesar
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @use Función para gestionar los actos
     * @return array
     */
    public static function gestionarActo($accion, $acto, $idEstudioMap) {
        $res[0] = -1;
        $den = ($accion == 'mod' ) ? $acto[0]->denominacion : $acto->actoDenominacion;

        $existe = DatActoModel::existeActo($den, $idEstudioMap);
        if ($accion == 'del')
            $res = ($accion == 'del') ? DatActoModel::eliminarActo($acto) : $res;

        else {
            $res = ($accion == 'ins' && count($existe) == 0) ? (DatActoModel::adicionarActo($acto, $idEstudioMap)) : $res;
            $res = ($accion == 'mod' && count($existe) >= 0 && count($existe) < 2 && ($existe[0]['idacto'] == $acto[0]->idacto || count($existe) == 0)) ? DatActoModel::modificarActo($acto) : $res;
        }
        return array('success' => true, 'idacto' => $res[0]);
    }

    /**
     * @copyright XETID Cuba
     * @name gestionarFuerza
     * @author Ing Grabiel Montero Coello
     * @param $accion : Acción a ejecutar sobre los datos
     * @param $fuerza : Objeto con los datos a procesar
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @user Función para gestionar las fuerzas
     * @return array
     */
    public function gestionarFuerza($accion, $fuerza, $idEstudioMap) {
        $res[0] = -1;
        $existe = DatFuerzaModel::existeFuerza($fuerza->fzaDenominacion, $idEstudioMap);
        if ($accion == 'del')
            $res = ($accion == 'del') ? DatFuerzaModel::eliminarFuerza($fuerza) : $res;
        else {
            $res = ($accion == 'ins' && count($existe) == 0) ? DatFuerzaModel::adicionarFuerza($fuerza, $idEstudioMap) : $res;
            $res = ($accion == 'mod' && count($existe) >= 0 && count($existe) < 2 && ($existe[0]['idfuerza'] == $fuerza->idfuerza || count($existe) == 0)) ? DatFuerzaModel::modificarFuerza($fuerza) : $res;
        }

        return array('success' => true, 'idfuerza' => $res[0]);
    }

    public function obtenerDatosMatriz($idEstudioMap) {
        $fuerzas = DatFuerzaModel::obtenerFuerzas(null, null, $idEstudioMap);
        $actos = DatActoModel::obtenerActos(null, null, $idEstudioMap);
        foreach ($fuerzas['root'] as $key => $fuerza) {
            $fuerzas['root'][$key]['fza'] = $fuerza['denominacion'];
            foreach ($actos['root'] as $acto) {
                $fuerzaacto = DatFuerzaacto::obtenerFuerzaActo($fuerza['idfuerza'], $acto['idacto']);
                $fuerzas['root'][$key]['i' . $acto['idacto']] = $fuerzaacto[0]['interes'];
                $fuerzas['root'][$key]['ci' . $acto['idacto']] = $fuerzaacto[0]['controlinstitucional'];
                $fuerzas['root'][$key]['ch' . $acto['idacto']] = $fuerzaacto[0]['controlhecho'];
                $fuerzas['root'][$key]['fpp' . $acto['idacto']] = $fuerzaacto[0]['factorpeso'];
                $fuerzas['root'][$key]['fpi' . $acto['idacto']] = $fuerzaacto[0]['factorinteres'];
            }
        }
        return $fuerzas['root'];
    }

    public function insertarDatosMatriz($objetos, $idEstudioMap) {
        $actos = DatActoModel::obtenerActos(null, null, $idEstudioMap);
        foreach ($objetos as $fuerza) {
            foreach ($actos['root'] as $acto) {
                $fa = DatFuerzaacto::obtenerFuerzaActo($fuerza->idfuerza, $acto['idacto']);
                if ($fa) {
                    $obj = DatFuerzaacto::getByid($fa[0]['idfuerzaacto']);
                    $obj->idfuerza = $fuerza->idfuerza;
                    $obj->idacto = $acto['idacto'];
                    $i = 'i' . $acto['idacto'];
                    $obj->interes = ($fuerza->$i) ? $fuerza->$i : 0;
                    $ci = 'ci' . $acto['idacto'];
                    $obj->controlinstitucional = ($fuerza->$ci) ? $fuerza->$ci : 0;
                    $ch = 'ch' . $acto['idacto'];
                    $obj->controlhecho = ($fuerza->$ch) ? $fuerza->$ch : 0;
                    $fpp = 'fpp' . $acto['idacto'];
                    $obj->factorpeso = ($fuerza->$fpp) ? $fuerza->$fpp : 0;
                    $fpi = 'fpi' . $acto['idacto'];
                    $obj->factorinteres = ($fuerza->$fpi) ? $fuerza->$fpi : 0;
                } else {
                    $obj = new DatFuerzaacto();
                    $obj->idfuerza = $fuerza->idfuerza;
                    $obj->idacto = $acto['idacto'];
                    $i = 'i' . $acto['idacto'];
                    $obj->interes = ($fuerza->$i) ? $fuerza->$i : 0;
                    $ci = 'ci' . $acto['idacto'];
                    $obj->controlinstitucional = ($fuerza->$ci) ? $fuerza->$ci : 0;
                    $ch = 'ch' . $acto['idacto'];
                    $obj->controlhecho = ($fuerza->$ch) ? $fuerza->$ch : 0;
                    $fpp = 'fpp' . $acto['idacto'];
                    $obj->factorpeso = ($fuerza->$fpp) ? $fuerza->$fpp : 0;
                    $fpi = 'fpi' . $acto['idacto'];
                    $obj->factorinteres = ($fuerza->$fpi) ? $fuerza->$fpi : 0;
                }
                $res = DatFuerzaacto::guardarFuerzaActo($obj);
            }
        }
        if ($res)
            return true;
        else
            return true;
    }

    public function contruirHtmlResultado($actos, $result) {
        for ($a = 0; $a < count($actos['root']); $a++) {
            $html = '<div class="margins">
			<div>
                            <p class="titulo">1. Valor de los actos y acci&oacute;n de las fuerzas </p></br>
                            <div>
                                <p class="subtitulo">Valor de los Actos </p>
                                <table>
                                   <tr>
                                        <td bgcolor="#CCCCCC" width="350"><strong>Acto </strong></td>
                                        <td bgcolor="#CCCCCC" width="75"><strong>Valor</strong></td>
                                  </tr>';
            foreach ($result[$a]['valoractos'] as $valoracto) {
                $html .= '<tr>
                                        <td width="350">' . htmlentities($valoracto['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                         <td>' . round($valoracto['va'], 4) . '</td>
                                </tr>';
            }
            $html .= '</table></br>
                            </div> 
                            <div>
                                <p class="subtitulo">Valor de las Acciones </p>
                                <table width="100%">
                                   <tr>
					<td bgcolor="#CCCCCC" width="350"><strong>Fuerza/Acto </strong></td>';
            foreach ($actos['root'] as $acto) {
                $html .= '<td bgcolor="#CCCCCC"><strong>' . $acto['denominacion'] . '</strong></td>';
            }
            $html .= '</tr>';
            foreach ($result[$a]['valoracciones'] as $valoracto) {
                $html .= '<tr>
                                        <td width="350">' . htmlentities($valoracto['fza'], ENT_QUOTES, 'UTF-8') . '</td>';
                foreach ($actos['root'] as $acto) {
                    $i = 'accion' . $acto['idacto'];
                    $html .= '<td>' . round($valoracto[$i], 4) . '</td>';
                }
                $html .= '</tr>';
            }
            $html .= '</table></br>
                            </div>
			</div>
			<div>
                            <p class="titulo">2. Matriz de antagonismos de las fuerzas </p>
                            <div>
                                <table width="100%">
                                   <tr>
                                        <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>';
            foreach ($result[$a]['matrizantagonismo'][0]['valores'] as $valores) {
                $html .= '<td bgcolor="#CCCCCC"><strong>' . $valores['fza'] . '</strong></td>';
            }
            $html .= '</tr>';
            $cant = count($result[$a]['matrizantagonismo']);
            for ($i = 0; $i < $cant; $i++) {
                $html .= '<tr>
					<td width="350">' . htmlentities($result[$a]['matrizantagonismo'][$i]['fza'], ENT_QUOTES, 'UTF-8') . '</td>';
                for ($j = 0; $j < $cant; $j++) {
                    $html .= ($i == $j) ? '<td bgcolor="#CCCCCC"></td>' : '<td>' . round($result[$a]['matrizantagonismo'][$i]['valores'][$j]['valor'], 4) . '</td>';
                }
                $html .= '</tr>';
            }
            $html .= '</table></br>
                            </div>
			</div>
			<div>';
            $factibilidad = $result[$a]['factibilidadinstitucional'];
            $html .= '<p class="titulo">3. Test de factibilidad institucional del acto ' . $factibilidad['denominacion'] . '</p></br>';
            $html .='<div>					
                            <p>Factibilidad institucional:' . round($factibilidad['factibilidadinstitucional'], 4) . '</p></br>
                            <p>Factibilidad institucional m&iacute;nima aceptable:' . $factibilidad['factibilidadinstitucionalminima'] . '</p></br>';
            if ($factibilidad['vim']) {
                $html .= '<p class="subtitulo">Transar con las fuerzas</p></br>
                                <p>Valor de inter&eacute;s m&iacute;nimo aceptable para transar:' . $factibilidad['vim'] . '</p></br>';
                if ($factibilidad['fuerzasatrazar'] && count($factibilidad['fuerzasatrazar']) > 0) {
                    $html .= '<table>
                                    <tr>
                                        <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                        <td bgcolor="#CCCCCC" width="75"><strong>Inter&eacute;s</strong></td>
                                    </tr>';
                    foreach ($factibilidad['fuerzasatrazar'] as $fuerzasatrazar) {
                        $html .= '<tr>
                                        <td width="350">' . htmlentities($fuerzasatrazar['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                        <td>' . htmlentities($fuerzasatrazar['interes'], ENT_QUOTES, 'UTF-8') . '</td>
                                    </tr>';
                    }
                    $html .= '</table></br>
                                <p>Grado de transacci&oacute;n:' . $factibilidad['gradotransaccion'] . '</p></br>
                                <p class="subtitulo">Conclusi&oacute;n parcial: El acto es factible institucionalmente pero requiere transacci&oacute;n</p></br>';
                } else {
                    $html .= '<p class="subtitulo">Conclusi&oacute;n parcial: No se puede transar con la cantidad de fuerzas necesarias. El acto no es factible institucionalmente</p></br>';
                }
            } else {
                $html .= '<p class="subtitulo">Conclusi&oacute;n parcial: El acto es factible institucionalmente</p></br>';
            }
            $html .= '</div></br>';
            $html .= '</div>
			<div>';
            $factibilidadhecho = $result[$a]['factibilidadhecho'];
            $html .= '<p class="titulo">4. Test de factibilidad de hecho del acto ' . $factibilidadhecho['denominacion'] . '</p></br>';
            $html .='<div>
                            <p>Factibilidad de hecho:' . round($factibilidadhecho['factibilidadhecho'], 4) . '</p></br>
                            <p>Factibilidad de hecho m&iacute;nima aceptable:' . $factibilidadhecho['factibilidadhechominima'] . '</p></br>';
            if ($factibilidadhecho['vim']) {
                $html .= '<p class="subtitulo">Transar con las fuerzas</p></br>
				<p>Valor de inter&eacute;s m&iacute;nimo aceptable para transar:' . $factibilidadhecho['vim'] . '</p></br>';
                if ($factibilidadhecho['fuerzasatrazar'] && count($factibilidadhecho['fuerzasatrazar']) > 0) {
                    $html .= '<table>
                                    <tr>
                                        <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                        <td bgcolor="#CCCCCC" width="75"><strong>Inter&eacute;s</strong></td>
                                    </tr>';
                    foreach ($factibilidadhecho['fuerzasatrazar'] as $fuerzasatrazar) {
                        $html .= '<tr>
                                        <td width="350">' . htmlentities($fuerzasatrazar['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                        <td>' . htmlentities($fuerzasatrazar['interes'], ENT_QUOTES, 'UTF-8') . '</td>
                                    </tr>';
                    }
                    $html .= '</table></br>
                                <p>Grado de transacci&oacute;n:' . $factibilidadhecho['gradotransaccion'] . '</p></br>
                                <p class="subtitulo">Conclusi&oacute;n parcial: El acto es factible para su ejecuci&oacute;n pero requiere transacci&oacute;n</p></br>';
                } else {
                    $html .= '<p class="subtitulo">Conclusi&oacute;n parcial: No hay disponibles fuerzas para transar. El acto no es factible para su ejecuci&oacute;n</p></br>';
                }
            } else {
                $html .= '<p class="subtitulo">Conclusi&oacute;n parcial: El acto es factible para su ejecuci&oacute;n</p></br>';
            }
            $html .= '</div></br>';
            $html .= '</div>
			<div>';
            $estabilidad = $result[$a]['estabilidad'];
            $html .= '<p class="titulo">5. Test de estabilidad del acto ' . $estabilidad['denominacion'] . '</p></br>';
            $html .='<div>
                            <p>Estabilidad:' . round($estabilidad['estabilidad'], 4) . '</p></br>
                            <p>Estabilidad m&iacute;nima aceptable:' . $estabilidad['estabilidadminima'] . '</p></br>';
            if ($estabilidad['ncm']) {
                $html .= '<p class="subtitulo">Aplicar compulsi&oacute;n</p></br>
				<p>Nivel de compulsi&oacute;n m&aacute;xima permitida:' . $estabilidad['ncm'] . '</p></br>';
                if ($estabilidad['fuerzascompulsion'] && count($estabilidad['fuerzascompulsion']) > 0) {
                    $html .= '<table>
                                    <tr>
                                        <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                        <td bgcolor="#CCCCCC" width="75"><strong>Inter&eacute;s</strong></td>
                                        <td bgcolor="#CCCCCC" width="150"><strong>Compulsi&oacute;n</strong></td>
                                    </tr>';
                    foreach ($estabilidad['fuerzascompulsion'] as $fuerzascompulsion) {
                        $html .= '<tr>
                                        <td width="350">' . htmlentities($fuerzascompulsion['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                        <td>' . htmlentities($fuerzascompulsion['interes'], ENT_QUOTES, 'UTF-8') . '</td>
                                        <td>' . round($fuerzascompulsion['compulsion'], 4) . '</td>
                                   </tr>';
                    }
                    $html .= '</table></br>
                                <p class="subtitulo">Conclusi&oacute;n parcial: El acto es estable pero requiere aplicar compulsi&oacute;n</p></br>';
                } else {
                    $html .= '<p class="subtitulo">Conclusi&oacute;n parcial: No se puede aplicar compulsi&oacute;n a la cantidad de fuerzas necesarias. El acto es inestable</p></br>';
                }
            } else {
                $html .= '<p class="subtitulo">Conclusi&oacute;n parcial: El acto es estable</p></br>';
            }
            $html .= '</div></br>';
            $html .= '</div>
			<div>';
            $solidez = $result[$a]['solidez'];
            $html .= '<p class="titulo">6. Solidez del acto ' . $solidez['denominacion'] . '</p></br>';
            $html .='<div>
                            <p class="subtitulo">Presiones que ejercen las fuerzas sobre el acto</p>
                            <table>
                                <tr>
                                    <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                    <td bgcolor="#CCCCCC" width="75"><strong>Presi&oacute;n</strong></td>
                                </tr>';
            foreach ($solidez['fuerzas'] as $fuerzas) {
                $html .= '<tr>
                                    <td width="350">' . htmlentities($fuerzas['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                    <td>' . round($fuerzas['presion'], 4) . '</td>
                               </tr>';
            }
            $html .= '</table></br>
			<p>Solidez del acto:' . round($solidez['solidez'], 4) . '</p></br>';

            $html .= ($solidez['solidez'] > 0) ? '<p class="subtitulo">Conclusi&oacute;n parcial: Hay concenso</p></br>' :
                    '<p class="subtitulo">Conclusi&oacute;n parcial: No hay concenso</p></br>
		</div></br>';
            $html .= '</div>
			<div>';
            $variacionpeso = $result[$a]['variacionpeso'];
            $html .= '<p class="titulo">7. Variaci&oacute;n del peso de las fuerzas tras la aplicaci&oacute;n del acto ' . $variacionpeso['denominacion'] . '</p></br>';
            $html .='<div>
                            <p class="subtitulo">Variables de entrada al c&aacute;lculo</p>
                            <p>g = ' . $variacionpeso['g'] . '</p>
                                <table>
                                <tr>
                                    <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                    <td bgcolor="#CCCCCC" width="75"><strong>f</strong></td>
                                </tr>';
            foreach ($variacionpeso['f'] as $f) {
                $html .= '<tr>
                                <td width="350">' . htmlentities($f['fza'], ENT_QUOTES, 'UTF-8') . '</td>
                                <td>' . htmlentities($f['f'], ENT_QUOTES, 'UTF-8') . '</td>
                            </tr>';
            };

            $html .= '</table></br>
                                <p class="subtitulo">Factores de ponderaci&oacute;n de peso de las fuerzas</p>
                            <table>
                                <tr>
                                    <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                    <td bgcolor="#CCCCCC" width="75"><strong>FPP</strong></td>
                                </tr>';
            foreach ($variacionpeso['fpp'] as $fpp) {
                $html .= '<tr>
                                <td width="350">' . htmlentities($fpp['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                <td>' . htmlentities($fpp['fpp'], ENT_QUOTES, 'UTF-8') . '</td>
                            </tr>';
            }
            $html .= '</table></br>
                            <p class="subtitulo">Variaci&oacute;n del peso de las fuerzas</p>
                        <table>
                            <tr>
                                <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                <td bgcolor="#CCCCCC" width="150"><strong>Variaci&oacute;n del peso</strong></td>
                            </tr>';
            foreach ($variacionpeso['variacion'] as $variacion) {
                $html .= '<tr>
                                <td width="350">' . htmlentities($variacion['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                <td>' . round($variacion['variacion'], 4) . '</td>
                            </tr>';
            }
            $html .= '</table></br>
                        </div></br>';
            $html .= '</div>
			<div>';
            $variacioninteres = $result[$a]['variacioninteres'];
            $html .= '<p class="titulo">8. Variaci&oacute;n del inter&eacute;s de las fuerzas tras la aplicaci&oacute;n del acto ' . $variacioninteres['denominacion'] . '</p></br>';
            $html .='<div>
                            <p class="subtitulo">Factores de ponderaci&oacute;n del inter&eacute;s de las fuerzas</p>
                            <table>
                                <tr>
                                    <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                    <td bgcolor="#CCCCCC" width="75"><strong>FPI</strong></td>
                                </tr>';
            foreach ($variacioninteres['fpi'] as $fpi) {
                $html .= '<tr>
                                <td width="350">' . htmlentities($fpi['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                <td>' . htmlentities($fpi['fpi'], ENT_QUOTES, 'UTF-8') . '</td>
                           </tr>';
            }
            $html .= '</table></br>
                        <p class="subtitulo">Variaci&oacute;n del inter&eacute;s de las fuerzas</p>
                        <table>
                            <tr>
                                <td bgcolor="#CCCCCC" width="350"><strong>Fuerzas </strong></td>
                                <td bgcolor="#CCCCCC" width="150"><strong>Variaci&oacute;n del inter&eacute;s</strong></td>
                            </tr>';
            foreach ($variacioninteres['variacion'] as $variacion) {
                $html .= '<tr>
                                <td width="350">' . htmlentities($variacion['denominacion'], ENT_QUOTES, 'UTF-8') . '</td>
                                <td>' . round($variacion['variacion'], 4) . '</td>
                            </tr>';
            }
            $html .= '</table></br>
                        </div></br>';
            $html .= '</div>
		</div>';

            $result['actos'][] = $html;
        }
        return $result['actos'];
    }

    public function generarResultado($objetos, $idEstudioMap) {
        $result = array();
        $actos = DatActoModel::obtenerActos(null, null, $idEstudioMap);
        foreach ($actos['root'] as $key => $acto) {
            $result[$key]['valoractos'] = self::calcularValorActo($objetos, $actos['root']);
            $result[$key]['valoracciones'] = self::calcularAcciones($objetos, $actos['root'], $result[$key]['valoractos']);
            $result[$key]['matrizantagonismo'] = self::antagonismoFuerzas($result, $key);
            $result[$key]['factibilidadinstitucional'] = self::testFactibilidadInstitucional($objetos, $acto);
            $result[$key]['factibilidadhecho'] = self::testFactibilidadHecho($objetos, $acto);
            $result[$key]['estabilidad'] = self::testEstabilidadActo($objetos, $acto);
            $result[$key]['solidez'] = self::solidezActo($objetos, $actos['root'], $acto, $result[$key]['valoractos']);
            $objetoinicial = $objetos;
            $result[$key]['variacionpeso'] = self::variacionPesoFuerzas($objetoinicial, $objetos, $acto, $result[$key]);
            if ($actos['root'][$key + 1])
                $idsiguienteacto = $actos['root'][$key + 1]['idacto'];
            else
                $idsiguienteacto = false;
            $result[$key]['variacioninteres'] = self::variacionInteresFuerzas($objetoinicial, $objetos, $acto, $result[$key], $idsiguienteacto);
        }

        return array('actos' => $actos, 'result' => $result);
    }

    public function calcularValorActo($objetos, $actos) {
        $result = array();
        foreach ($actos as $acto) {
            $suma = 0;
            $act = array();
            $act['denominacion'] = $acto['denominacion'];
            $act['idacto'] = $acto['idacto'];
            foreach ($objetos as $obj) {
                $pos = 'i' . $acto['idacto'];
                $suma += pow($obj[$pos], 2);
            }
//            $va = round($suma / count($objetos), 4);
            $va = $suma / count($objetos);
            $act['va'] = $va;
            $result[] = $act;
        }
        return $result;
    }

    public function calcularAcciones($objetos, $actos, $valoracto) {
        $result = array();
        foreach ($objetos as $fueza) {
            $acc['fza'] = $fueza['fza'];
            $acc['idfuerza'] = $fueza['idfuerza'];
            foreach ($actos as $key => $acto) {
                $pos = 'i' . $acto['idacto'];
                $interes = $fueza[$pos];
//                $acc['accion' . $acto['idacto']] = round($interes * $valoracto[$key]['va'], 4);
                $acc['accion' . $acto['idacto']] = $interes * $valoracto[$key]['va'];
            }
            $result[] = $acc;
        }
        return $result;
    }

    public function antagonismoFuerzas($valoracciones, $actoanalizado) {
        $cantactos = count($valoracciones[0]['valoractos']);
        $max = self::getMaxAntagonismo($valoracciones, $cantactos, $actoanalizado);
        $cantfuerzas = count($valoracciones[0]['valoracciones']);
        $fuerza = array();
        for ($v = 0; $v < $cantactos; $v++) {
            $idacto = $valoracciones[0]['valoractos'][$v]['idacto'];
            for ($i = 0; $i < $cantfuerzas; $i++) {
                $fuerza[$i]['idfuerza'] = $valoracciones[0]['valoracciones'][$i]['idfuerza'];
                $fuerza[$i]['fza'] = $valoracciones[0]['valoracciones'][$i]['fza'];
                for ($j = 0; $j < $cantfuerzas; $j++) {
                    if ($i == $j) {
                        $fuerza[$i]['valores'][$j]['idfuerza'] = $valoracciones[0]['valoracciones'][$j]['idfuerza'];
                        $fuerza[$i]['valores'][$j]['fza'] = $valoracciones[0]['valoracciones'][$j]['fza'];
                        $fuerza[$i]['valores'][$j]['valor'] = 'X';
                    } else {
                        $fuerza[$i]['valores'][$j]['idfuerza'] = $valoracciones[0]['valoracciones'][$j]['idfuerza'];
                        $fuerza[$i]['valores'][$j]['fza'] = $valoracciones[0]['valoracciones'][$j]['fza'];
//                        $newvalue = round($valoracciones[$actoanalizado]['valoracciones'][$i]['accion' . $idacto] - $valoracciones[$actoanalizado]['valoracciones'][$j]['accion' . $idacto], 4);
                        $newvalue = $valoracciones[$actoanalizado]['valoracciones'][$i]['accion' . $idacto] - $valoracciones[$actoanalizado]['valoracciones'][$j]['accion' . $idacto];
                        if ($fuerza[$i]['valores'][$j]['valor'])
                            $fuerza[$i]['valores'][$j]['valor'] += abs($newvalue);
                        else
                            $fuerza[$i]['valores'][$j]['valor'] = abs($newvalue);
                    }
                }
            }
        }
        foreach ($fuerza as $key => $value) {
            foreach ($value['valores'] as $k => $valores) {
                if ($valores['valor'] != 'X') {
//                    $fuerza[$key]['valores'][$k]['valor'] = round($valores['valor'] / $max, 4);
                    $fuerza[$key]['valores'][$k]['valor'] = $valores['valor'] / $max;
                }
            }
        }
        return $fuerza;
    }

    public function getMaxAntagonismo($valoracciones, $cantactos, $actoanalizado) {
        $result = array();
        $cantfuerzas = count($valoracciones[0]['valoracciones']);
        for ($v = 0; $v < $cantactos; $v++) {
            $idacto = $valoracciones[0]['valoractos'][$v]['idacto'];
            $cantcombinaciones = 0;
            for ($i = 0; $i < $cantfuerzas - 1; $i++) {
                for ($j = $i + 1; $j < $cantfuerzas; $j++) {
                    $newvalue = $valoracciones[$actoanalizado]['valoracciones'][$i]['accion' . $idacto] - $valoracciones[$actoanalizado]['valoracciones'][$j]['accion' . $idacto];
                    if ($valores[$cantcombinaciones])
                        $valores[$cantcombinaciones] += abs($newvalue);
                    else
                        $valores[$cantcombinaciones] = abs($newvalue);
                    $cantcombinaciones++;
                }
            }
        }
        return max($valores);
    }

    public function testFactibilidadInstitucional(&$objetos, $acto) {
        $act = array();
        $suma = 0;
        $act['denominacion'] = $acto['denominacion'];
        $act['idacto'] = $acto['idacto'];
        $pos = 'ci' . $acto['idacto'];
        $interes = 'i' . $acto['idacto'];
        foreach ($objetos as $obj) {
            if ($obj[$interes] > 0)
                $suma += $obj[$pos];
        }
        $act['factibilidadinstitucional'] = $suma;
        $act['factibilidadinstitucionalminima'] = $acto['factibilidadinstitucional'];

        if ($act['factibilidadinstitucional'] <= $act['factibilidadinstitucionalminima']) {
            $act['vim'] = $acto['valorinteres'];
            $transar = -0.1;
            while ($transar >= $act['vim']) {
                foreach ($objetos as $key => $obj) {
                    if ($obj[$interes] >= $transar && $obj[$interes] <= 0) {
                        $fuerza['denominacion'] = $obj['fza'];
                        $fuerza['interes'] = $obj[$interes];
                        $act['fuerzasatrazar'][] = $fuerza;
                        $objetos[$key][$interes] += $act['factibilidadinstitucional'];
                        $suma += $obj[$pos];
                        if ($suma > $act['factibilidadinstitucionalminima'])
                            break;
                    }
                }
                if ($suma > $act['factibilidadinstitucionalminima'])
                    break;
                else
                    $transar -= 0.1;
            }
            $act['gradotransaccion'] = $transar; //no me queda claro que sea ese el grado
        }
        return $act;
    }

    public function testFactibilidadHecho(&$objetos, $acto) {
        $act = array();
        $suma = 0;
        $act['denominacion'] = $acto['denominacion'];
        $act['idacto'] = $acto['idacto'];
        $pos = 'ch' . $acto['idacto'];
        $interes = 'i' . $acto['idacto'];
        foreach ($objetos as $obj) {
            if ($obj[$interes] > 0)
                $suma += $obj[$pos];
        }
        $act['factibilidadhecho'] = $suma;
        $act['factibilidadhechominima'] = $acto['factibilidadhecho'];

        if ($act['factibilidadhecho'] < $act['factibilidadhechominima']) {
            $act['vim'] = $acto['valorinteres'];
            $transar = -0.1;
            while ($transar >= $act['vim']) {
                foreach ($objetos as $key => $obj) {
                    if ($obj[$interes] >= $transar && $obj[$interes] <= 0) {
                        $fuerza['denominacion'] = $obj['fza'];
                        $fuerza['interes'] = $obj[$interes];
                        $act['fuerzasatrazar'][] = $fuerza;
                        $objetos[$key][$interes] += $act['factibilidadinstitucional'];
                        $suma += $obj[$pos];
                        if ($suma > $act['factibilidadinstitucionalminima'])
                            break;
                    }
                }
                if ($suma > $act['factibilidadinstitucionalminima'])
                    break;
                else
                    $transar -= 0.1;
            }
            $act['gradotransaccion'] = $transar;
        }
        return $act;
    }

    public function testEstabilidadActo($objetos, $acto) {
        $act = array();
        $suma = 0;
        $act['denominacion'] = $acto['denominacion'];
        $act['idacto'] = $acto['idacto'];
        $pos = 'ch' . $acto['idacto'];
        $interes = 'i' . $acto['idacto'];
        foreach ($objetos as $obj) {
            $suma += $obj[$pos] * $obj[$interes];
        }
//        $act['estabilidad'] = round($suma, 4);
        $act['estabilidad'] = $suma;
        $act['estabilidadminima'] = $acto['estabilidadminima'];

        if ($act['estabilidad'] < $act['estabilidadminima']) {
            $act['ncm'] = $acto['nivelcompulsionmax'];
            //falta ordenar las fuerzas por el interes de mayor a menor antes de recorrer el arreglo 
            foreach ($objetos as $obj) {
                if ($obj[$interes] < 0) {
                    $fuerza['denominacion'] = $obj['fza'];
                    $fuerza['interes'] = $obj[$interes];
//                    $fuerza['compulsion'] = round(($act['estabilidadminima'] - $act['estabilidad']) * $obj[$pos], 4);
                    $fuerza['compulsion'] = ($act['estabilidadminima'] - $act['estabilidad']) * $obj[$pos];
                    $act['fuerzascompulsion'][] = $fuerza;
                }
            }
        }
        return $act;
    }

    public function solidezActo($objetos, $actos, $acto, $valoractos) {
        $result = array();
        $valoracciones = self::calcularAcciones($objetos, $actos, $valoractos);
        $act = array();
        $act['denominacion'] = $acto['denominacion'];
        $act['idacto'] = $acto['idacto'];
        foreach ($objetos as $obj) {
            $va = self::getValorAcciones($valoracciones, $obj['idfuerza'], $acto['idacto']);
            $fuerza['denominacion'] = $obj['fza'];
//            $fuerza['presion'] = round($va * $obj['peso'], 4);
            $fuerza['presion'] = $va * $obj['peso'];
            $act['fuerzas'][] = $fuerza;
        }
        $solidez = 0;
        foreach ($act['fuerzas'] as $fuerza) {
            $solidez += $fuerza['presion'];
        }
        $act['solidez'] = $solidez;
        return $act;
    }

    public function getValorAcciones($valoracciones, $idfuerza, $idacto) {
        foreach ($valoracciones as $va) {
            if ($va['idfuerza'] == $idfuerza) {
                return $va['accion' . $idacto];
            }
        }
        return false;
    }

    public function variacionPesoFuerzas($objetoinicial, &$objetos, $acto, $result) {
        $solidez = $result['solidez'];
        $factibilidadinstitucional = $result['factibilidadinstitucional'];
        $factibilidadhecho = $result['factibilidadhecho'];
        $valoracciones = $result['valoracciones'];
        $act = array();
        $act['denominacion'] = $acto['denominacion'];
        $act['idacto'] = $acto['idacto'];
        $interes = 'i' . $acto['idacto'];

        $act['g'] = ($solidez['solidez'] > 0) ? 1 : -1;

        foreach ($objetoinicial as $key => $obj) {
            $esfactibleinstitucional = ($factibilidadinstitucional['factibilidadinstitucional'] < $factibilidadinstitucional['factibilidadinstitucionalminima'] && count($fact['fuerzasatrazar']) == 0) ? false : true;
            $esfactiblehecho = ($factibilidadhecho['factibilidadhecho'] < $factibilidadhecho['factibilidadhechominima'] && count($fact['fuerzasatrazar'] == 0)) ? false : true;

            if (($obj[$interes] > 0 && $esfactibleinstitucional && $esfactiblehecho) || ($obj[$interes] < 0 && (!$esfactibleinstitucional || !$esfactiblehecho))) {
                $act['f'][$key]['f'] = 1;
                $act['f'][$key]['fza'] = $obj['fza'];
            } else {
                $act['f'][$key]['f'] = -1;
                $act['f'][$key]['fza'] = $obj['fza'];
            }
            $fpp = 'fpp' . $acto['idacto'];
            $fuerzaponderacion['denominacion'] = $obj['fza'];
            $fuerzaponderacion['fpp'] = $obj[$fpp];
            $act['fpp'][] = $fuerzaponderacion;

            $sumapesos = self::sumarTodosPesos($objetoinicial);
            $sumaacciones = self::sumarTodasAcciones($objetoinicial, $valoracciones, $acto['idacto']);
            $valoraccion = self::getValorAcciones($valoracciones, $obj['idfuerza'], $acto['idacto']);

            $variacion['denominacion'] = $obj['fza'];
            $variacion['idfuerza'] = $obj['idfuerza'];
//            $variacion['variacion'] = round($obj[$fpp] * $obj['peso'] * ($valoraccion * $act['g'] + ($sumaacciones / $sumapesos) * $act['f'][$key]['f']), 4);
            $variacion['variacion'] = $obj[$fpp] * $obj['peso'] * ($valoraccion * $act['g'] + ($sumaacciones / $sumapesos) * $act['f'][$key]['f']);
            $act['variacion'][] = $variacion;
        }
        foreach ($objetos as $key => $obj) {
            foreach ($act['variacion'] as $variac) {
                if ($obj['idfuerza'] == $variac['idfuerza']) {
                    $objetos[$key]['peso'] += $variac['variacion'];
                }
            }
        }
        return $act;
    }

    public function sumarTodosPesos($objetos) {
        $suma = 0;
        foreach ($objetos as $obj) {
            $suma += $obj['peso'];
        }
        return $suma;
    }

    public function sumarTodasAcciones($objetos, $valoracciones, $idacto) {
        $suma = 0;
        $pos = 'accion' . $idacto;
        foreach ($valoracciones as $val) {
            foreach ($objetos as $obj) {
                if ($obj['idfuerza'] == $val['idfuerza']) {
                    $peso = $obj['peso'];
                }
            }
            $suma += $val[$pos] * $peso;
        }
        return $suma;
    }

    public function variacionInteresFuerzas($objetoinicial, &$objetos, $acto, $result, $idsiguienteacto) {
        $matrizantagonismo = $result['matrizantagonismo'];
        $variacionpeso = $result['variacionpeso'];
        $act = array();
        $act['denominacion'] = $acto['denominacion'];
        $act['idacto'] = $acto['idacto'];
        foreach ($objetoinicial as $key => $obj) {
            $fpi = 'fpi' . $acto['idacto'];
            $fuerzaponderacion['denominacion'] = $obj['fza'];
            $fuerzaponderacion['fpi'] = $obj[$fpi];
            $act['fpi'][] = $fuerzaponderacion;

            $sumatoria = self::sumarTodosAntagonismos($matrizantagonismo, $obj['idfuerza'], $variacionpeso, $objetoinicial);

            $variacion['denominacion'] = $obj['fza'];
            $variacion['idfuerza'] = $obj['idfuerza'];
//            $variacion['variacion'] = round(($obj[$fpi] * $sumatoria / (count($objetos) - 1)), 4);
            $variacion['variacion'] = $obj[$fpi] * $sumatoria / (count($objetos) - 1);
            $act['variacion'][] = $variacion;
            if ($idsiguienteacto) {
                $interes = 'i' . $idsiguienteacto;
                $objetos[$key][$interes] += $variacion['variacion'];
            }
        }
        return $act;
    }

    public function sumarTodosAntagonismos($matrizantagonismo, $idfuerza, $variacionpeso, $objetos) {
        $suma = 0;
        foreach ($matrizantagonismo as $fuerza) {
            if ($fuerza['idfuerza'] == $idfuerza) {
                foreach ($fuerza['valores'] as $valores) {
                    if ($valores['idfuerza'] != $idfuerza) {
                        $variacionpesofuerza = self::getVariacionPeso($variacionpeso, $valores['idfuerza']);
                        $pesofuerza = self::getPesoFuerza($objetos, $valores['idfuerza']);
                        $suma += $valores['valor'] * $variacionpesofuerza / $pesofuerza;
                    }
                }
            }
        }
        return $suma;
    }

    public function getVariacionPeso($variacionpeso, $idfuerza) {
        foreach ($variacionpeso['variacion'] as $variac) {
            if ($variac['idfuerza'] == $idfuerza) {
                return $variac['variacion'];
            }
        }
    }

    public function getPesoFuerza($objetos, $idfuerza) {
        foreach ($objetos as $obj) {
            if ($obj['idfuerza'] == $idfuerza) {
                return $obj['peso'];
            }
        }
    }
    
    public function formatearResultados($res){
        $actos = array();
        foreach ($res['actos']['root'] as $key => $act) {
            $actos[$key]['idacto'] = $act['idacto'];
            $actos[$key]['denominacion'] = $act['denominacion'];
        }
        foreach ($res['result'] as $key => $act) {
            if ($act['factibilidadinstitucional']['vim']) {
                if ($act['factibilidadinstitucional']['fuerzasatrazar'] && count($act['factibilidadinstitucional']['fuerzasatrazar']) > 0) {
                    $actos[$key]['factibilidadinstitucional'] = 'El acto es factible institucionalmente </br>pero requiere transacci&oacute;n';
                } else {
                    $actos[$key]['factibilidadinstitucional'] = 'No se puede transar </br>con la cantidad de fuerzas necesarias. </br>El acto no es factible institucionalmente';
                }
            } else {
                $actos[$key]['factibilidadinstitucional'] = 'El acto es factible institucionalmente';
            }

            if ($act['factibilidadhecho']['vim']) {
                if ($act['factibilidadinstitucional']['fuerzasatrazar'] && count($act['factibilidadinstitucional']['fuerzasatrazar']) > 0) {
                    $actos[$key]['factibilidadhecho'] = 'El acto es factible para su ejecuci&oacute;n </br>pero requiere transacci&oacute;n';
                } else {
                    $actos[$key]['factibilidadhecho'] = 'No hay disponibles fuerzas para transar. </br>El acto no es factible para su ejecuci&oacute;n';
                }
            } else {                
                $actos[$key]['factibilidadhecho'] = 'El acto es factible para su ejecuci&oacute;n';
            }

            if ($act['estabilidad']['ncm']) {
                if ($act['estabilidad']['fuerzascompulsion'] && count($act['estabilidad']['fuerzascompulsion']) > 0) {
                    $actos[$key]['estabilidadacto'] = 'El acto es estable </br>pero requiere aplicar compulsi&oacute;n';                    
                } else {
                    $actos[$key]['estabilidadacto'] = 'No se puede aplicar compulsi&oacute;n </br>a la cantidad de fuerzas necesarias. </br>El acto es inestable';
                }
            } else {
                $actos[$key]['estabilidadacto'] = 'El acto es estable';
            }

            if ($act['solidez']['solidez'] > 0) {
                $actos[$key]['solidezacto'] = 'Hay concenso';
            } else {
                $actos[$key]['solidezacto'] = 'No hay concenso';
            }
        }
        
        return $actos;
    }
	
	/**
     * Obtiene todos los datos necesarios para generar reporte
     *
     * @param $params
     *
     * @return array
     * @author    Ing. Jesús Ariel Guerra Lópex
     * @copyrigth XETID, Cuba
     */
    public function getDatosReporte($params) {

        $data = array();
        $datosMatriz = $this->obtenerMatriz($params['idestudiomap']);
        
		$data[0]->columnasActos = array();
		$data[0]->idActos = array();
		
		foreach($datosMatriz['actos'] as $acto){
			$data[0]->columnasActos[] = $acto['denominacion'];
			$data[0]->idActos[] = $acto['idacto'];
		}
		
        $data[0]->tipo = 'combinada';
		$data[0]->columnasExtra = array(array('inicio'=>array('Fuerza'),'fin'=>array('Peso de la fuerza')));
		$data[0]->referenciaExtra = array(array('inicio'=>array('denominacion'),'fin'=>array('peso')));
        $data[0]->columnas = array('I','CI','CH','FPP','FPI');
        $data[0]->referencia = array('i','ci','ch','fpp','fpi');
        $data[0]->encabezado = 'Matriz de datos';
        $data[0]->colspan = $datosMatriz['config']['colspan'];
        $data[0]->datos = $datosMatriz['fuerzas'];
		
		$res = DatEstudiomatrizdanalisispoliticoModel::generarResultado($datosMatriz, $params['idestudiomap']);
        $actos = DatEstudiomatrizdanalisispoliticoModel::formatearResultados($res);
		
		$data[1]->tipo = 'estandar';
		$data[1]->columnas = array('Actos/Resultados','Factibilidad institucional','Factibilidad de hecho',
		'Estabilidad del acto','Solidez del acto');
		$data[1]->referencia = array('denominacion','factibilidadinstitucional','factibilidadhecho',
		'estabilidadacto','solidezacto');
		$data[1]->encabezado = 'Resumen de los resultados';
		$data[1]->datos = $actos;

        return $data;
    }
            

}
