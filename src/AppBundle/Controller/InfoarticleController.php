<?php

namespace AppBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Template() 
 */
class InfoarticleController extends Controller{
    /**
     * @Route("/infoarticle/{i}",name="infoarticle")
     */
    function indexAction($i){
        $connect = $this->get('database_connection');
        $info['infos'] = $connect->fetchAll("SELECT * FROM items where CompanyC=".$i);
        $menuRepository = $this->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:Menu');
            $menu['result'] = $menuRepository->showAction();
        $data = [
            'menu'=>$menu['result'],
            'info'=>$info['infos'],
          ];
        
        return $this->render('AppBundle:Company:list.html_1.twig',compact('data')); 
    }
} 