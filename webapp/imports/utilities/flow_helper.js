import { FlowRouter } from 'meteor/kadira:flow-router'

export const pathFor = ( path, params ) => {
  let query = params && params.query ? FlowRouter._qs.parse( params.query ) : {}
  console.log("query:", query)
  return FlowRouter.path( path, params, query )
}

export const urlFor = ( path, params ) => {
  return Meteor.absoluteUrl( pathFor( path, params ) )
}

export const currentRoute = ( route ) => {
  FlowRouter.watchPathChange()
  return FlowRouter.current().route.name === route ? 'active' : ''
}
